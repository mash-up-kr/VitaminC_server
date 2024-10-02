import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { InjectRepository } from '@mikro-orm/nestjs';
import { AzureOpenAI, OpenAI } from 'openai';
import { ChatCompletionTool } from 'openai/resources/chat/completions';
import { Observable } from 'rxjs';

import {
  GPT_USAGE_MAX_LIMIT,
  RESTAURANT_CATEGORY_LIST,
} from 'src/common/constants';
import { KakaoPlace, Place, User } from 'src/entities';
import { GptUsage } from 'src/entities/gpt-usage.entity';
import { GptUsageRepository } from 'src/entities/gpt-usage.repository';
import { GptUsageResponseDto } from 'src/gpt/dto/gpt-usage-response.dto';
import { SearchService } from 'src/search/search.service';

@Injectable()
export class GptService {
  private openai: OpenAI;
  private azureOpenai: AzureOpenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly searchService: SearchService,
    @InjectRepository(GptUsage)
    private readonly gptUsageRepository: GptUsageRepository,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('GPT_KEY'),
    });
  }

  async checkIfIsBadWordWithGpt(text: string): Promise<boolean> {
    const systemPrompt = `
      You are an AI assistant that check if a word user provide is badword in Korean.

      Return only the boolean type in javascript language as your response.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        temperature: 0.2,
      });

      const res = response.choices[0].message?.content;

      if (!['true', 'false'].includes(res)) {
        return false;
      }

      return JSON.parse(res);
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  async recommendRestaurants(
    user: User,
    question: string,
    currentUserLongitude: string,
    currentUserLatitude: string,
  ): Promise<Observable<MessageEvent<any>>> {
    try {
      const tools: ChatCompletionTool[] = [
        {
          type: 'function',
          function: {
            name: 'extractLocationAndCategory',
            description: `사용자의 질문에서 위치나 장소를 추출하세요. 만약 질문에 위치나 장소가 없다면 ‘없음’이라고 답변하세요.
        또한 사용자의 질문에서 사용자가 원하는 음식을 아래 카테고리 중에서 선택하여 답변하세요.
        만약 음식점 추천과 관련없는 질문을 하면 음식점 추천을 위한 올바른 질문을 하라고 격식차리지 않고 친절하게 답변해주세요.
        
        #카테고리 
        ${RESTAURANT_CATEGORY_LIST.join(', ')}
        `,
            parameters: {
              type: 'object',
              properties: {
                extractedLocation: {
                  type: 'string',
                  description: '사용자의 음식점 검색 위치',
                },
                extractedCategory: {
                  type: 'string',
                  description: '사용자가 원하는 음식 종류',
                },
              },
              required: ['extractedLocation', 'extractedCategory'],
              additionalProperties: false,
            },
          },
        },
      ];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: question }],
        tools: tools,
      });

      // # 장소 추출
      if (response.choices[0].finish_reason === 'tool_calls') {
        const toolCall = response.choices[0].message.tool_calls[0];
        const argumentsObj = JSON.parse(toolCall.function.arguments);

        const extractedLocation = argumentsObj['extractedLocation'];
        const extractedCategory = argumentsObj['extractedCategory'];
        console.log('### 추출된 정보');
        console.log(extractedLocation + ', ' + extractedCategory);

        // # 위치 검색
        let longitudeToSearch = currentUserLongitude;
        let latitudeToSearch = currentUserLatitude;
        if (extractedLocation !== '없음') {
          const searchedLocation =
            await this.searchService.searchLocationByKeyword(extractedLocation);
          if (searchedLocation.length > 0) {
            longitudeToSearch = searchedLocation[0].x;
            latitudeToSearch = searchedLocation[0].y;
          }
          console.log('### 찾은 위치');
          console.log(searchedLocation[0]);
        }

        // # 음식점 검색
        let searchedPlaces = [];
        if (RESTAURANT_CATEGORY_LIST.includes(extractedCategory)) {
          searchedPlaces = await this.searchService.searchPlaceByKeyword(
            extractedCategory,
            longitudeToSearch,
            latitudeToSearch,
          );
          console.log(
            `### 추출된 카테고리: ${extractedCategory}로 검색된 음식점 리스트`,
          );
        } else {
          searchedPlaces = await this.searchService.searchPlaceByCategory(
            longitudeToSearch,
            latitudeToSearch,
          );
          console.log('### 검색된 가장 가까운 음식점 리스트');
        }
        const searchedPlacesWithDetail = await this.getRandomPlacesDetail(
          searchedPlaces,
          3,
        );

        // # GPT 추천
        const parsedStringList = searchedPlacesWithDetail.map(
          (place, index) => {
            return `${index + 1}. 가게명: ${place.name}, 평점: ${place.score.toFixed(1)}`;
          },
        );

        const prompt = `
      제공된 음식점 정보는 사용자의 요구에 맞게 이미 추천된 음식점들이야.
      사용자의 요구를 바탕으로 추천하는 이유를 간결한 문장으로 격식차리지 않고 친절하게 답변해줘.
       
      #음식점 정보
      ${parsedStringList.join('\n')}
    `;
        console.log('### prompt');
        console.log(prompt);

        return new Observable((observer) => {
          this.openai.chat.completions
            .create({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: prompt },
                { role: 'user', content: question },
              ],
              stream: true,
            })
            .then((response) => {
              const reader = response.toReadableStream().getReader();
              const processStream = async () => {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) {
                    break;
                  }
                  const chunk = new TextDecoder().decode(value);
                  const payloads = chunk.split('\n\n');

                  for (const payload of payloads) {
                    if (payload.includes('[DONE]')) {
                      break;
                    }
                    if (payload.trim() !== '') {
                      const data = JSON.parse(payload.replace(/^data: /, ''));
                      if (
                        data.choices &&
                        data.choices[0].delta &&
                        data.choices[0].delta.content
                      ) {
                        // @ts-ignore
                        observer.next({
                          type: 'text',
                          data: data.choices[0].delta.content,
                        });
                      }
                    }
                  }
                }
                searchedPlacesWithDetail.slice(0, 3).forEach((restaurant) => {
                  // @ts-ignore
                  observer.next({
                    type: 'json',
                    data: restaurant,
                  });
                });
                await this.incrementGptUsage(user);
                observer.complete();
              };

              processStream().catch((error) => observer.error(error));
            })
            .catch((error) => observer.error(error));
        });
      } else {
        return new Observable((observer) => {
          const textStream = response.choices[0].message.content.split('');
          const sendChars = async () => {
            for (const char of textStream) {
              await new Promise((resolve) => setTimeout(resolve, 20));
              // @ts-ignore
              observer.next({
                type: 'text',
                data: char,
              });
            }
            await this.incrementGptUsage(user);
            observer.complete();
          };

          sendChars().catch((error) => {
            console.log(error);
            observer.error(error);
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  // 장소와 키워드에 따라 동일한 음식점 계속 나와서 6개중에 3개 랜덤으로..
  async getRandomPlacesDetail(
    places: Place[],
    count: number,
  ): Promise<KakaoPlace[]> {
    const selectedPlaces = [];
    const selectedIndices = new Set<number>();

    while (selectedPlaces.length < count) {
      const randomIndex = Math.floor(Math.random() * places.length);
      if (!selectedIndices.has(randomIndex)) {
        selectedPlaces.push(places[randomIndex]);
        selectedIndices.add(randomIndex);
      }
    }

    const placeDetails = await Promise.allSettled(
      selectedPlaces.map((place) =>
        this.searchService.searchPlaceDetail(place.id, false),
      ),
    );

    return placeDetails
      .filter((result) => result.status === 'fulfilled')
      .map((fulfilledResult) => {
        return (fulfilledResult as PromiseFulfilledResult<KakaoPlace>).value;
      });
  }

  async incrementGptUsage(user: User): Promise<void> {
    const usageDate = this.getCurrentDate();
    const usageLimit = await this.gptUsageRepository.findOne({
      user,
      ...usageDate,
    });

    if (usageLimit) {
      usageLimit.usageCount += 1;
    } else {
      const gptUsage = new GptUsage();
      gptUsage.user = user;
      gptUsage.usageYear = usageDate.usageYear;
      gptUsage.usageMonth = usageDate.usageMonth;
      gptUsage.usageDay = usageDate.usageDay;
      gptUsage.usageCount = 1;
      this.gptUsageRepository.persist(gptUsage);
    }
    await this.gptUsageRepository.flush();
  }

  async isGptUsageLimitExceeded(user: User): Promise<boolean> {
    const usageDate = this.getCurrentDate();
    const gptUsage = await this.gptUsageRepository.findOne({
      user,
      ...usageDate,
    });
    return gptUsage && gptUsage.usageCount >= gptUsage.maxLimit;
  }

  getCurrentDate(): {
    usageYear: number;
    usageMonth: number;
    usageDay: number;
  } {
    const now = new Date();
    const usageYear = now.getFullYear();
    const usageMonth = now.getMonth() + 1;
    const usageDay = now.getDate();

    return { usageYear, usageMonth, usageDay };
  }

  async getGptUsageByUser(user: User): Promise<GptUsageResponseDto> {
    const usageDate = this.getCurrentDate();
    const gptUsage = await this.gptUsageRepository.findOne({
      user,
      ...usageDate,
    });
    if (!gptUsage) {
      const gptUsage = new GptUsage();
      gptUsage.user = user;
      gptUsage.usageYear = usageDate.usageYear;
      gptUsage.usageMonth = usageDate.usageMonth;
      gptUsage.usageDay = usageDate.usageDay;
      gptUsage.usageCount = 0;
      gptUsage.maxLimit = GPT_USAGE_MAX_LIMIT;
      return new GptUsageResponseDto(gptUsage);
    }
    return new GptUsageResponseDto(gptUsage);
  }
}

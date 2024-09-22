import { Controller, Get, Param, Query, Sse } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Observable } from 'rxjs';

import { UseAuthGuard } from 'src/common/decorators/auth-guard.decorator';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User, UserRole } from 'src/entities';
import { GptUsageLimitExceededException } from 'src/exceptions';
import { testPlaces } from 'src/gpt/__fixtures__/stream-test-places';
import { GptUsageResponseDto } from 'src/gpt/dto/gpt-usage-response.dto';

import { GptService } from './gpt.service';

@ApiTags('gpt')
@ApiBearerAuth()
@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @UseAuthGuard([UserRole.USER])
  @ApiResponse({ type: GptUsageResponseDto })
  @Get('usage')
  async getGptUsage(@CurrentUser() user: User) {
    return await this.gptService.getGptUsageByUser(user);
  }

  @Get(':word')
  checkIfIsBadWordx(@Param('word') word: string) {
    return this.gptService.checkIfIsBadWordWithGpt(word);
  }

  @UseAuthGuard([UserRole.USER])
  @Sse('restaurants/recommend')
  async recommendRestaurants(
    @CurrentUser() user: User,
    @Query('question') question: string,
    // default x,y 강남역으로 해놨음
    @Query('x') x: string = '127.027926',
    @Query('y') y: string = '37.497175',
  ): Promise<Observable<MessageEvent>> {
    console.time('Execution Time');
    if (await this.gptService.isGptUsageLimitExceeded(user)) {
      throw new GptUsageLimitExceededException();
    }
    const result = await this.gptService.recommendRestaurants(
      user,
      question,
      x,
      y,
    );
    console.timeEnd('Execution Time');
    return result;
  }

  @UseAuthGuard([UserRole.USER])
  @Sse('restaurants/recommend/test')
  async recommendRestaurantsTest(
    @CurrentUser() user: User,
    @Query('question') question: string,
    // default x,y 강남역으로 해놨음
    @Query('x') x: string = '127.027926',
    @Query('y') y: string = '37.497175',
  ): Promise<Observable<MessageEvent>> {
    return new Observable((observer) => {
      const processStream = async () => {
        const textStream =
          '테스트테스트테스트줄넘기\n테스트테스트테스트테스트테스트테스트테스트🤩테스트테스트'.split(
            '',
          );

        for (const char of textStream) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          // @ts-ignore
          observer.next({
            type: 'text',
            data: char,
          });
        }
        testPlaces.forEach((testPlace) => {
          // @ts-ignore
          observer.next({
            data: testPlace,
            type: 'json',
          });
        });
        observer.complete();
      };
      processStream().catch((error) => observer.error(error));
    });
  }
}

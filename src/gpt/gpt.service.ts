import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import OpenAI from 'openai';

@Injectable()
export class GptService {
  private openai: OpenAI;
  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('GPT_KEY'),
    });
  }

  async checkIfIsBadwordWithGpt(text: string) {
    const systemPrompt = `
      You are an AI assistant that check if a word user provide is badword in Korean.

      Return only the boolean type in javascript language as your response.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 0.2,
    });

    console.log(`Prompt tokens: ${response.usage.prompt_tokens}`);
    console.log(`Completion tokens: ${response.usage.completion_tokens}`);
    console.log(`Total tokens: ${response.usage.total_tokens}`);

    const res = response.choices[0].message?.content;

    if (!['true', 'false'].includes(res)) {
      return false;
    }

    return JSON.parse(res);
  }
}

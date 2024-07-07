import { Controller, Get, Injectable, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UseAuthGuard } from 'src/common/decorators/auth-guard.decorator';

import { GptService } from './gpt.service';

@Injectable()
@ApiTags('gpt')
@ApiBearerAuth()
@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Get(':word')
  @UseAuthGuard(['ADMIN'])
  checkIfIsBadWordx(@Param('word') word: string) {
    return this.gptService.checkIfIsBadwordWithGpt(word);
  }
}

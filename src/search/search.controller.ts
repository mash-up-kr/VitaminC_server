import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiQuery({ type: String, name: 'q', description: '검색을 원하는 질의어' })
  @Get('suggest')
  async searchPlace(@Query('q') q: string) {
    return await this.searchService.suggest(q);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateMapDto } from './dtos/create-map.dto';
import { MapResponseDto } from './dtos/map-response.dto';
import { UpdateMapDto } from './dtos/update-map.dto';
import { MapService } from './map.service';

@ApiTags('maps')
@Controller('api/v1/maps')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Post()
  @ApiOkResponse({ type: MapResponseDto })
  create(@Body() createMapDto: CreateMapDto) {
    return this.mapService.create(createMapDto);
  }

  @Get()
  @ApiOkResponse({ type: [MapResponseDto] })
  findAll() {
    return this.mapService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: MapResponseDto })
  findOne(@Param('id') id: string) {
    return this.mapService.findOne({ id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: MapResponseDto })
  update(@Param('id') id: string, @Body() updateMapDto: UpdateMapDto) {
    return this.mapService.update(id, updateMapDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Number })
  remove(@Param('id') id: string) {
    return this.mapService.remove(id);
  }
}

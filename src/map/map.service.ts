import { Injectable } from '@nestjs/common';

import { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { wrap } from '@mikro-orm/postgresql';

import { CreateMapDto } from './dtos/create-map.dto';
import { UpdateMapDto } from './dtos/update-map.dto';
import { GroupMap } from './entities/map.entity';
import { MapRepository } from './map.repository';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(GroupMap) private readonly mapRepository: MapRepository,
  ) {}
  async create(createMapDto: CreateMapDto) {
    const map: GroupMap = this.mapRepository.create(createMapDto);
    await this.mapRepository.persistAndFlush(map);
    return map;
  }

  findAll(): Promise<GroupMap[]> {
    return this.mapRepository.findAll();
  }

  findOne(where: FilterQuery<GroupMap>): Promise<GroupMap> {
    return this.mapRepository.findOne(where);
  }
  async update(id: string, updateMapDto: UpdateMapDto) {
    const map = await this.mapRepository.findOneOrFail(id);
    wrap(map).assign(updateMapDto);
    await this.mapRepository.persistAndFlush(map);
    return map;
  }

  remove(id: string) {
    return this.mapRepository.nativeDelete({ id });
  }
}

import { Injectable } from '@nestjs/common';

import { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { GroupMap, GroupMapRepository } from 'src/entities';

import { CreateMapDto } from './dtos/create-map.dto';
import { UpdateMapDto } from './dtos/update-map.dto';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(GroupMap)
    private readonly mapRepository: GroupMapRepository,
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
    // TODO: 이거 다시 구현
    await this.mapRepository.persistAndFlush(map);
    return map;
  }

  remove(id: string) {
    return this.mapRepository.nativeDelete({ id });
  }
}

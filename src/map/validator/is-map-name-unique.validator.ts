import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { GroupMap, GroupMapRepository } from 'src/entities';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsMapNameUnique implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(GroupMap)
    private readonly mapRepository: GroupMapRepository,
  ) {}

  async validate(name: string, args: ValidationArguments) {
    const map = await this.mapRepository.findOne({ name });
    return !map;
  }

  defaultMessage(args: ValidationArguments) {
    return '$value은(는) 이미 존재하는 지도 이름입니다.';
  }
}

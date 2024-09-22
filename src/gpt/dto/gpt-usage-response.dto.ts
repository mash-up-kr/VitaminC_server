import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { GptUsage, User } from 'src/entities';

export class GptUsageResponseDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  usageCount: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  maxLimit: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  usageYear: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  usageMonth: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  usageDay: number;

  constructor(gptUsage: GptUsage) {
    this.usageCount = gptUsage.usageCount;
    this.maxLimit = gptUsage.maxLimit;
    this.usageYear = gptUsage.usageYear;
    this.usageMonth = gptUsage.usageMonth;
    this.usageDay = gptUsage.usageDay;
  }
}

import { ApiProperty } from '@nestjs/swagger';

export class KickUserDto {
  @ApiProperty()
  userId: number;
}

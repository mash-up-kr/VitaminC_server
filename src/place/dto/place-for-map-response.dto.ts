import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { KakaoPlace, Place, PlaceForMap, User } from 'src/entities';
import { TagResponseDto } from 'src/map/dtos/tag-response.dto';

export class CreatedUser implements Partial<User> {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: String, nullable: true })
  nickname: string | null = null;

  constructor(user: User) {
    this.id = user.id;
    this.nickname = user.nickname;
  }
}
export class MenuItem {
  @ApiProperty()
  menu: string;

  @ApiProperty()
  price: string;
}

export class OpenTime {
  @ApiProperty()
  dayOfWeek: string;

  @ApiProperty()
  timeName: string;

  @ApiProperty()
  timeSE: string;
}

export class OffDay {
  @ApiProperty()
  holidayName: string;

  @ApiProperty()
  weekAndDay: string;

  @ApiProperty()
  temporaryHolidays: string;
}

export class KakaoPlaceResponseDto implements Partial<KakaoPlace> {
  @ApiProperty({
    description: '카카오맵에서 제공하는 장소의 ID (basicInfo.cid)',
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: '카카오맵 basicInfo.placenamefull' })
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  x: number;

  @ApiProperty()
  y: number;

  @ApiProperty({
    type: MenuItem,
    isArray: true,
  })
  menuList: MenuItem[];

  @ApiProperty({ type: String, isArray: true })
  photoList: string[];
}

export class PlaceResponseDto implements Partial<Place> {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: KakaoPlaceResponseDto })
  kakaoPlace: KakaoPlace;

  @ApiProperty()
  x: number;

  @ApiProperty()
  y: number;
}

export class PlaceForMapResponseDto {
  @ApiProperty({ type: PlaceResponseDto })
  place: PlaceResponseDto;

  @ApiProperty({ type: TagResponseDto, isArray: true })
  tags: TagResponseDto[];

  @ApiProperty({ type: Object, isArray: true })
  comments: { photoUrls: string[]; comment: string; userId: number }[];

  @ApiProperty({ type: Number, isArray: true })
  likedUserIds: number[];

  @ApiProperty({ type: CreatedUser })
  createdBy: CreatedUser;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(placeForMap: PlaceForMap) {
    this.place = placeForMap.place;
    this.tags = placeForMap.tags
      .getItems()
      .map((tag) => new TagResponseDto(tag));
    this.comments = placeForMap.comments;
    this.likedUserIds = placeForMap.likedUserIds;
    this.createdBy = new CreatedUser(placeForMap.createdBy);
    this.createdAt = placeForMap.createdAt;
    this.updatedAt = placeForMap.updatedAt;
  }
}

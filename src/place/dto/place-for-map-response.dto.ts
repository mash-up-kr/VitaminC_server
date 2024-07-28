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

  @ApiProperty()
  photo: string;
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
  @ApiProperty()
  @IsNotEmpty()
  kakaoId: number;

  @ApiProperty()
  isRegisteredPlace: boolean;

  @ApiProperty()
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

  @ApiProperty()
  mainPhotoUrl: string;

  @ApiProperty({ type: String, isArray: true })
  photoList: string[];

  @ApiProperty()
  score: number;

  @ApiProperty()
  commentCnt: number;

  @ApiProperty()
  blogReviewCnt: number;

  @ApiProperty({ type: OpenTime, isArray: true })
  openTimeList: OpenTime[];

  @ApiProperty({ type: OffDay, isArray: true })
  offDayList: OffDay[];

  constructor(kakaoPlace: KakaoPlace) {
    this.kakaoId = kakaoPlace.id;
    this.isRegisteredPlace = false;
    this.name = kakaoPlace.name;
    this.category = kakaoPlace.category;
    this.address = kakaoPlace.address;
    this.x = kakaoPlace.x;
    this.y = kakaoPlace.y;
    this.menuList = kakaoPlace.menuList;
    this.mainPhotoUrl = kakaoPlace.mainPhotoUrl;
    this.photoList = kakaoPlace.photoList;
    this.score = kakaoPlace.score;
    this.commentCnt = kakaoPlace.commentCnt;
    this.blogReviewCnt = kakaoPlace.blogReviewCnt;
    this.openTimeList = kakaoPlace.openTimeList;
    this.offDayList = kakaoPlace.offDayList;
  }
}

export class PlaceResponseDto implements KakaoPlaceResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  kakaoId: number;

  @ApiProperty()
  mapId: string;

  @ApiProperty()
  isRegisteredPlace: boolean;

  @ApiProperty({ type: Number, isArray: true })
  likedUserIds: number[];

  @ApiProperty({ type: TagResponseDto, isArray: true })
  tags: TagResponseDto[];

  @ApiProperty({ type: CreatedUser })
  createdBy: CreatedUser;

  @ApiProperty()
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

  @ApiProperty()
  mainPhotoUrl: string;

  @ApiProperty({ type: String, isArray: true })
  photoList: string[];

  @ApiProperty()
  score: number;

  @ApiProperty()
  commentCnt: number;

  @ApiProperty()
  blogReviewCnt: number;

  @ApiProperty({ type: OpenTime, isArray: true })
  openTimeList: OpenTime[];

  @ApiProperty({ type: OffDay, isArray: true })
  offDayList: OffDay[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(placeForMap: PlaceForMap) {
    const { place } = placeForMap;
    const { kakaoPlace } = place;

    this.id = place.id;
    this.kakaoId = kakaoPlace.id;
    this.mapId = placeForMap.map.id;
    this.isRegisteredPlace = true;
    this.likedUserIds = placeForMap.likedUserIds;
    this.tags = placeForMap.tags.map((tag) => new TagResponseDto(tag));
    this.createdBy = new CreatedUser(placeForMap.createdBy);
    this.name = kakaoPlace.name;
    this.category = kakaoPlace.category;
    this.address = kakaoPlace.address;
    this.x = kakaoPlace.x;
    this.y = kakaoPlace.y;
    this.menuList = kakaoPlace.menuList;
    this.mainPhotoUrl = kakaoPlace.mainPhotoUrl;
    this.photoList = kakaoPlace.photoList;
    this.score = kakaoPlace.score;
    this.commentCnt = kakaoPlace.commentCnt;
    this.blogReviewCnt = kakaoPlace.blogReviewCnt;
    this.openTimeList = kakaoPlace.openTimeList;
    this.offDayList = kakaoPlace.offDayList;
    this.createdAt = placeForMap.createdAt;
    this.updatedAt = placeForMap.updatedAt;
  }
}

export class PlaceForMapResponseDto {
  @ApiProperty({ type: Place })
  place: Place;

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

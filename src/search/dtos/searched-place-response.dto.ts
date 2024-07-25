import { ApiProperty } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { PlaceForMap } from 'src/entities';
import { CreatedUser } from 'src/place/dto/place-for-map-response.dto';
import { KakaoPlaceItem } from 'src/search/kakao-map.types';

export class SearchedPlaceResponseDto {
  @ApiProperty()
  isRegisteredPlace: boolean;

  @ApiProperty()
  kakaoId: number;

  @ApiProperty()
  category: string;

  @ApiProperty()
  x: number;

  @ApiProperty()
  y: number;

  @ApiProperty()
  placeName: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  placeId: number;

  @ApiProperty()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ type: CreatedUser })
  @IsOptional()
  createdBy?: CreatedUser;

  @ApiProperty()
  @IsOptional()
  score?: number;

  @ApiProperty()
  @IsOptional()
  likedUserIds?: number[];

  constructor(searchedPlace: KakaoPlaceItem | PlaceForMap) {
    if ('place' in searchedPlace) {
      const { place } = searchedPlace;
      const { kakaoPlace } = place;

      this.isRegisteredPlace = true;
      this.kakaoId = kakaoPlace.id;
      this.category = kakaoPlace.category;
      this.x = kakaoPlace.x;
      this.y = kakaoPlace.y;
      this.placeName = kakaoPlace.name;
      this.address = kakaoPlace.address;
      this.placeId = place.id;
      this.tags = searchedPlace.tags.map((tag) => `#${tag.name}`);
      this.createdBy = new CreatedUser(searchedPlace.createdBy);
      this.score = kakaoPlace.score;
      this.likedUserIds = searchedPlace.likedUserIds;
    } else {
      this.isRegisteredPlace = false;
      this.kakaoId = Number(searchedPlace.id);
      this.category = searchedPlace.category_group_name;
      this.x = Number(searchedPlace.x);
      this.y = Number(searchedPlace.y);
      this.placeName = searchedPlace.place_name;
      this.address = searchedPlace.road_address_name;
    }
  }
}

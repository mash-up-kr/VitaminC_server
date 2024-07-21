import { ApiProperty } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { PlaceForMap } from 'src/entities';
import { CreatedUser } from 'src/place/dto/place-for-map-response.dto';
import { KakaoPlaceItem } from 'src/search/kakao-map.types';

export class SearchedPlaceResponseDto {
  @ApiProperty()
  kakaoId: number;

  @ApiProperty()
  categoryGroupName: string;

  @ApiProperty()
  categoryName: string;

  @ApiProperty()
  x: number;

  @ApiProperty()
  y: number;

  @ApiProperty()
  placeName: string;

  @ApiProperty()
  addressName: string;

  @ApiProperty()
  roadAddressName: string;

  @ApiProperty()
  placeId: number;

  @ApiProperty()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ type: CreatedUser })
  @ApiProperty()
  createdBy: CreatedUser;

  @ApiProperty()
  @IsOptional()
  score?: number;

  @ApiProperty()
  @IsOptional()
  likedUserCount?: number;

  constructor(searchedPlace: KakaoPlaceItem | PlaceForMap) {
    if ('place' in searchedPlace) {
      const { place } = searchedPlace;
      const { kakaoPlace } = place;

      this.kakaoId = kakaoPlace.id;
      this.categoryName = kakaoPlace.category;
      this.x = kakaoPlace.x;
      this.y = kakaoPlace.y;
      this.placeName = kakaoPlace.name;
      this.addressName = kakaoPlace.address;
      this.placeId = place.id;
      this.tags = searchedPlace.tags.map((tag) => `#${tag.content}`);
      this.createdBy = new CreatedUser(searchedPlace.createdBy);
      this.score = kakaoPlace.score;
      this.likedUserCount = searchedPlace.likedUserIds.length;
    } else {
      this.kakaoId = Number(searchedPlace.id);
      this.categoryGroupName = searchedPlace.category_group_name;
      this.categoryName = searchedPlace.category_name;
      this.x = Number(searchedPlace.x);
      this.y = Number(searchedPlace.y);
      this.placeName = searchedPlace.place_name;
      this.addressName = searchedPlace.address_name;
      this.roadAddressName = searchedPlace.road_address_name;
    }
  }
}

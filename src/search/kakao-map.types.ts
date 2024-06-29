// 좌표계 enum 정의
export enum KakaoCoordinateSystem {
  WGS84 = 'WGS84', // 위경도 좌표계
  WCONGNAMUL = 'WCONGNAMUL',
  CONGNAMUL = 'CONGNAMUL', // 카카오 좌표계 (카카오맵 rect로 나옴)
  WTM = 'WTM',
  TM = 'TM',
  KTM = 'KTM',
  UTM = 'UTM',
  BESSEL = 'BESSEL',
  WKTM = 'WKTM',
  WUTM = 'WUTM',
}

// 인터페이스 정의
export interface KakaoCoordinateConversionParams {
  x: number; // X 좌표값, 경위도인 경우 longitude(경도)
  y: number; // Y 좌표값, 경위도인 경우 latitude(위도)
  input_coord?: KakaoCoordinateSystem; // x, y 값의 좌표계 (기본값: WGS84)
  output_coord: KakaoCoordinateSystem; // 변환할 좌표계 (기본값: WGS84)
}

export enum KakaoCategoryGroupCode {
  '대형마트' = 'MT1',
  '편의점' = 'CS2',
  '어린이집, 유치원' = 'PS3',
  '학교' = 'SC4',
  '학원' = 'AC5',
  '주차장' = 'PK6',
  '주유소, 충전소' = 'OL7',
  '지하철역' = 'SW8',
  '은행' = 'BK9',
  '문화시설' = 'CT1',
  '중개업소' = 'AG2',
  '공공기관' = 'PO3',
  '관광명소' = 'AT4',
  '숙박' = 'AD5',
  '음식점' = 'FD6',
  '카페' = 'CE7',
  '병원' = 'HP8',
  '약국' = 'PM9',
}

export interface KakaoKeywordSearchParams {
  query: string; // 검색을 원하는 질의어
  category_group_code?: KakaoCategoryGroupCode; // 카테고리 그룹 코드, 카테고리로 결과 필터링을 원하는 경우 사용
  x?: string; // 중심 좌표의 X 혹은 경도(longitude) 값
  y?: string; // 중심 좌표의 Y 혹은 위도(latitude) 값
  radius?: number; // 중심 좌표부터의 반경거리 (미터(m), 최소: 0, 최대: 20000). 특정 지역을 중심으로 검색하려면 x, y와 함께 사용
  rect?: string; // 사각형의 지정 범위 내 제한 검색을 위한 좌표 (좌측 X 좌표, 좌측 Y 좌표, 우측 X 좌표, 우측 Y 좌표 형식)
  page?: number; // 결과 페이지 번호 (최소: 1, 최대: 45, 기본값: 1)
  size?: number; // 한 페이지에 보여질 문서의 개수 (최소: 1, 최대: 15, 기본값: 15)
  sort?: 'distance' | 'accuracy'; // 결과 정렬 순서 (distance 정렬을 원할 때는 기준 좌표로 쓰일 x, y와 함께 사용, 기본값: accuracy)
}

export type KakaoPlaceItem = {
  address_name: string; // "서울 강남구 역삼동 669-17"
  category_group_code: string; // "FD6"
  category_group_name: string; // "음식점"
  category_name: string; // "음식점 > 한식 > 육류,고기 > 곱창,막창"
  distance: string; // ""
  id: string; // "1261894710"
  phone: string; // "02-555-7364"
  place_name: string; // "세광양대창 역삼GS타워점"
  place_url: string; // "http://place.map.kakao.com/1261894710"
  road_address_name: string; // "서울 강남구 논현로94길 13"
  x: string; // "127.037366122263"
  y: string; // "37.5026329250425"
};

export type KakaoPlaceDetailRaw = {
  isMapUser: string; // "ERROR"
  isExist: boolean; // true
  basicInfo: {
    cid: number; // 762214594
    placenamefull: string; // "정분네중앙곱창 강남본점"
    mainphotourl: string; // "http://t1.daumcdn.net/place/6DCE4A7D51924FE3A4437B8C91C553D4"
    phonenum: string; // "02-3482-2337"
    address: {
      newaddr: {
        newaddrfull: string; // "서초대로77길 35"
        bsizonno: string; // "06612"
      };
      region: {
        name3: string; // "서초동"
        fullname: string; // "서울 서초구 서초동"
        newaddrfullname: string; // "서울 서초구"
      };
      addrbunho: string; // "1308-12"
      addrdetail: string; // "1층"
    };
    wpointx: number; // 505600
    wpointy: number; // 1111485
    roadview: {
      panoid: number; // 1171334557
      tilt: number; // 0
      pan: number; // 223.363
      wphotox: number; // 505617
      wphotoy: number; // 1111503
      rvlevel: number; // 2
    };
    category: {
      cateid: string; // "727"
      catename: string; // "곱창,막창"
      cate1name: string; // "음식점"
      fullCateIds: string; // "9|124|18165|727"
    };
    feedback: {
      allphotocnt: number; // 335
      blogrvwcnt: number; // 38
      comntcnt: number; // 14
      scoresum: number; // 32
      scorecnt: number; // 14
      reviewphotocnt: number; // 1
    };
    openHour: {
      periodList: {
        '0': {
          periodName: string; // "영업기간"
          timeList: {
            '0': {
              timeName: string; // "영업시간"
              timeSE: string; // "16:00 ~ 05:00"
              dayOfWeek: string; // "매일"
            };
          };
        };
      };
      realtime: {
        holiday: string; // "N"
        breaktime: string; // "N"
        open: string; // "Y"
        moreOpenOffInfoExists: string; // "N"
        datetime: string; // "20240629185922"
        currentPeriod: {
          periodName: string; // "영업기간"
          timeList: {
            '0': {
              timeName: string; // "영업시간"
              timeSE: string; // "16:00 ~ 05:00"
              dayOfWeek: string; // "매일"
            };
          };
        };
        closedToday: string; // "N"
      };
    };
    payments: {
      imgUrl: string; // "https://t1.kakaocdn.net/kakaomap_mobile/android/ico_zeropay.png"
      landingUrl: string; // "https://www.zeropay.or.kr"
    }[];
    tags: string[];
    source: {
      date: string; // "2024.01.26."
    };
  };
  menuInfo: {
    moreyn: string; // "Y"
    menuList: {
      '0': {
        price: string; // "14,000"
        recommend: boolean; // false
        menu: string; // "구이양념막창"
      };
      '1': {
        price: string; // "14,000"
        recommend: boolean; // false
        menu: string; // "소금구이막창"
      };
      '2': {
        price: string; // "15,000"
        recommend: boolean; // false
        menu: string; // "야채곱창볶음"
      };
      '3': {
        price: string; // "17,000"
        recommend: boolean; // false
        menu: string; // "순대곱창볶음"
      };
    };
    productyn: string; // "N"
    menuboardphotourl: string; // "https://postfiles.pstatic.net/MjAyNDA2MTJfNzQg/MDAxNzE4MTQ3ODA5OTMw.zeLbX5XZ9nkUSuo38EpVkuEo7IXMWg9C4lIWASeTVB0g.q2QQTpKvHlOMQQk9osA0wYHWd2_qy6u0wiaWi1YlqNIg.JPEG/IMG_0736.jpg?type=w773"
    menuboardphotocount: number; // 30
    timeexp: string; // "2024.01.25."
  };
  photo: {
    photoCount: number; // 335
    photoList: {
      photoid: string; // "M"
      orgurl: string; // "http://t1.daumcdn.net/place/6DCE4A7D51924FE3A4437B8C91C553D4"
    }[];
    sortedPhotoList: {
      photoid: string; // "Tfood935698273"
      orgurl: string; // "https://postfiles.pstatic.net/MjAyNDAzMjBfOTAg/MDAxNzEwODkzMDAxNjQw.zqZaIHYTcWW3eQhusMhZEjwPfZDlbyztLXc-G_WOedUg.Z2QvhMnLfJahDnC5cquqpbfewKiLR_Wnb3NLmvy21skg.JPEG/IMG_3371.JPG?type=w966"
      categoryName: string; // "음식"
    }[];
  };
  placeSubscribeInfo: {
    cnt: number; // 0
    isSubscriber: boolean; // false
  };
};

import { HttpService } from '@nestjs/axios';

import nock from 'nock';

import { KakaoMapHelper } from './kakao-map.helper';
import { SearchService } from './search.service';

require('dotenv').config({ path: '.development.env' });

nock.back.fixtures = `${__dirname}/__fixtures__`;

describe('search.service', () => {
  const http = new HttpService();
  const sut = new SearchService(http, new KakaoMapHelper(http));

  it('can suggest search keyword', async () => {
    nock.back.setMode('lockdown');
    const { nockDone } = await nock.back('search-suggest-01.json');
    const result = await sut.suggest('곱창');

    nockDone();
    expect(result).toMatchInlineSnapshot(`
      [
        "곱창전골",
        "곱창집",
        "곱창맛집",
        "곱창고",
        "곱창이야기",
        "곱창볶음",
        "곱창폭식",
        "곱창의전설",
        "곱창구이",
        "곱창전골맛집",
        "곱창정비소",
        "곱창파는고깃집",
        "곱창가",
        "곱창왕김형제",
        "곱창마을",
        "곱창나라",
        "곱창대장",
        "곱창팩토리",
        "곱창국수",
        "곱창지존",
      ]
    `);
  });

  it('can search kakao retaurent data', async () => {
    nock.back.setMode('lockdown');
    const { nockDone } = await nock.back('search-retaurent-01.json');

    const result = await search(
      'https://m.map.kakao.com/actions/searchView?q=%EA%B3%B1%EC%B0%BD&wxEnc=MOSQTP&wyEnc=QNOLPRNINRR&lvl=1&rect=504945,1111188.125,506025,1111753.125&viewmap=true',
    );

    nockDone();

    expect(
      result.map((item) => `${item.place_name} -> ${item.road_address_name}`),
    ).toMatchInlineSnapshot(`
      [
        "마포한우곱창 -> 서울 서초구 서초대로73길 42",
        "더막창스 강남본점 -> 서울 서초구 서초대로77길 37",
        "서초네거리곱창 -> 서울 서초구 강남대로65길 12",
        "쁨포차 강남역점 -> 서울 서초구 서초대로77길 43",
        "정분네중앙곱창 강남본점 -> 서울 서초구 서초대로77길 35",
        "진구곱창 -> 서울 서초구 서초대로75길 37",
      ]
    `);
  });

  it('can search kakao retaurent data', async () => {
    nock.back.setMode('lockdown');
    const { nockDone } = await nock.back('search-retaurent-02.json');

    const result = await search(
      `https://m.map.kakao.com/actions/searchView?q=${encodeURIComponent(
        '활어회',
      )}&wxEnc=MOSQTP&wyEnc=QNOLPRNINRR&lvl=1&rect=504945,1111188.125,506025,1111753.125&viewmap=true`,
    );

    nockDone();

    expect(
      result.map((item) => `${item.place_name} -> ${item.road_address_name}`),
    ).toMatchInlineSnapshot(`
      [
        "응야끼도리 -> 서울 서초구 서초대로77길 43",
        "사쿠라테이엔 강남본점 -> 서울 서초구 서초대로75길 36",
        "나노하나 -> 서울 서초구 서초대로73길 42",
        "서초세꼬시 -> 서울 서초구 서초대로73길 50",
        "시선 -> 서울 서초구 서초대로77길 35",
        "주나수산 -> 서울 서초구 서초대로77길 45",
        "은행골 강남역점 -> 서울 서초구 서초대로75길 34",
        "신선한형제들 -> 서울 서초구 강남대로65길 12",
        "야키토리 토라미 -> 서울 서초구 서초대로75길 45",
        "어사출또 강남역점 -> 서울 서초구 서초대로77길 37",
        "청담이상 강남역점 -> 서울 강남구 테헤란로1길 42",
        "동방제일수산 강남역점 -> 서울 서초구 서초대로73길 42",
        "나에코 -> 서울 서초구 서초대로75길 45",
        "만원수산 -> 서울 서초구 서초대로77길 37",
        "이자카야 공감 강남역점 -> 서울 서초구 강남대로65길 7",
      ]
    `);
  });

  it('can search place detail', async () => {
    nock.back.setMode('lockdown');
    const { nockDone } = await nock.back('search-retaurent-detail-01.json');

    const data = await sut.searchPlaceDetail('762214594');

    nockDone();

    expect(data.basicInfo).toMatchInlineSnapshot(`
      {
        "address": {
          "addrbunho": "1308-12",
          "addrdetail": "1층",
          "newaddr": {
            "bsizonno": "06612",
            "newaddrfull": "서초대로77길 35",
          },
          "region": {
            "fullname": "서울 서초구 서초동",
            "name3": "서초동",
            "newaddrfullname": "서울 서초구",
          },
        },
        "category": {
          "cate1name": "음식점",
          "cateid": "727",
          "catename": "곱창,막창",
          "fullCateIds": "9|124|18165|727",
        },
        "cid": 762214594,
        "feedback": {
          "allphotocnt": 335,
          "blogrvwcnt": 38,
          "comntcnt": 14,
          "reviewphotocnt": 1,
          "scorecnt": 14,
          "scoresum": 32,
        },
        "isStation": false,
        "mainphotourl": "http://t1.daumcdn.net/place/6DCE4A7D51924FE3A4437B8C91C553D4",
        "openHour": {
          "periodList": [
            {
              "periodName": "영업기간",
              "timeList": [
                {
                  "dayOfWeek": "매일",
                  "timeName": "영업시간",
                  "timeSE": "16:00 ~ 05:00",
                },
              ],
            },
          ],
          "realtime": {
            "breaktime": "N",
            "closedToday": "N",
            "currentPeriod": {
              "periodName": "영업기간",
              "timeList": [
                {
                  "dayOfWeek": "매일",
                  "timeName": "영업시간",
                  "timeSE": "16:00 ~ 05:00",
                },
              ],
            },
            "datetime": "20240629190601",
            "holiday": "N",
            "moreOpenOffInfoExists": "N",
            "open": "Y",
          },
        },
        "payments": [
          {
            "imgUrl": "https://t1.kakaocdn.net/kakaomap_mobile/android/ico_zeropay.png",
            "landingUrl": "https://www.zeropay.or.kr",
          },
        ],
        "phonenum": "02-3482-2337",
        "placenamefull": "정분네중앙곱창 강남본점",
        "regions": [
          {
            "depth": 1,
            "id": "I",
            "name": "서울",
          },
          {
            "depth": 2,
            "id": "I1014",
            "name": "서초구",
          },
          {
            "depth": 3,
            "id": "I10140300",
            "name": "서초동",
          },
        ],
        "roadview": {
          "pan": 223.363,
          "panoid": 1171334557,
          "rvlevel": 2,
          "tilt": 0,
          "wphotox": 505617,
          "wphotoy": 1111503,
        },
        "source": {
          "date": "2024.01.26.",
        },
        "tags": [
          "노포",
          "제로페이",
        ],
        "wpointx": 505600,
        "wpointy": 1111485,
      }
    `);
  });

  async function search(kakaoMapUrl: string) {
    // https://m.map.kakao.com/actions/searchView?q=%EC%B9%B4%ED%8E%98&wxEnc=MOPNSP&wyEnc=QNOLRRLIM&lvl=3&rect=504215,1110542.5,508535,1112802.5&viewmap=true
    const searchParams = new URL(kakaoMapUrl).searchParams;
    const kakaoRect = searchParams.get('rect');
    const query = decodeURIComponent(searchParams.get('q'));
    return await sut.searchPlaceList(query, kakaoRect, { isKakaoCoord: true });
  }
});

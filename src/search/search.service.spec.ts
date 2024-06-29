import { HttpService } from '@nestjs/axios';

import nock from 'nock';

import { SearchService } from './search.service';

nock.back.fixtures = `${__dirname}/__fixtures__`;

describe('search.service', () => {
  const sut = new SearchService(new HttpService());

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
});

import { sleep } from 'k6';
import http from 'k6/http';

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<20000'], // 95% of requests should be below 200ms
    // http_reqs: ['count > 10'],          // 요청 수가 10개 초과
  },
  vus: 19,
  // duration: '10s',
  iterations: 19,
};

// const URL = 'http://localhost:8000';
const URL = 'https://api-dev.korrk.kr';
const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAyLCJpYXQiOjE3MjgyNzgwMTAsImV4cCI6MTcyODM2NDQxMH0.FYfLYt9Ukh6eqAUMOLNbYZ05Sh87SuQr5IKfKgoAjXXPBeo5XG2pq2JT536e6Hf5gVCQ4UutxlbxVJPpVj7BbL2iM5mj35tt8sq7j7Iwx5TxvQi7IsANSs7fhDE9Gu0n1C3ym8sScDvis6gLQuN5lrP-eXBem6cpA5E43ApUMH_V_UtQyNVRToFmZDgTMAx6B9rRfrEm_Yw5nOvHysgQZ-SHJh-Dlic1y9NcsdI7rbmeq69J1jd6f4g6IvCmGSnDW0VxwzHYffkAh0OGhYP0-6gygIQ-7BvhdPHKnIwfirdfOx4fQUxh3gfiuGpOyT3J98PI0DdAvnwwCRF0G5BYow';
export default function () {
  // http.get('https://korrk.kr');
  const headers = {
    authorization: 'Bearer ' + token,
  };
  //?offset=0&limit=30
  http.get(
    URL + '/place/9e45b065-9d68-4113-9a5e-1cd278b8883a?offset=0&limit=30',
    { headers: headers },
  );

  // sleep(;
}

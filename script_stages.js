import http from 'k6/http';
import { check, sleep } from 'k6';

// You can also have the VU level ramp up and down during the test. The options.stages property allows you to configure ramping behaviour.

export let options = {
  stages: [
    { duration: '15s', target: 10 },
    // { duration: '10s', target: 100 },
    // { duration: '10s', target: 1000 },
  ],
};
// get
export default function () {
  let res = http.get('http://localhost:3000/qa/questions/2');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}

// put
// export default function () {
//   let res = http.put('http://localhost:3000/qa/answers/100000/helpful');
//   check(res, { 'status was 204': (r) => r.status == 204 });
//   sleep(1);
// }

// post

// export default function () {

//   var payload = JSON.stringify({
//     body: 'aaaaa',
//     name: 'bbbbb',
//     email: 'ccccc',
//     product_id: 1
//   });

//   var params = {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };

//   let res = http.post('http://localhost:3000/qa/questions', payload, params);
//   check(res, { 'status was 201': (r) => r.status == 201 });
//   sleep(1);
// }
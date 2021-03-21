import http from 'k6/http';
import { sleep } from 'k6';

// same as typing --vus 10 and --duration 30s into CLI
export let options = {
  vus: 10,
  duration: '30s',
};

// init code outside which will run once per VU

export default function () {
  // vu (virtual user) code - runs over and over while test is running
  // http.get('http://test.k6.io');
  http.get('http://localhost:3000/qa/questions/100');
  sleep(1);
}

/* VU code can make HTTP requests, emit metrics, and generally do everything you'd expect a load test to do - with a few important exceptions: you can't load anything from your local filesystem, or import any other modules. This all has to be done from init-code. */
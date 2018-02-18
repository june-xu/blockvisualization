import axios from 'axios';

//const backendUrl = 'http://2bd419b8.ngrok.io:1000';
const backendUrl = 'http://127.0.0.1:4000';

export function postBackend() {
  return axios.post(`${backendUrl}/api/v1`, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    first_date: 1,
    last_date: 1512413453,
    year_length: 2,
    type: 'historical',
    accounts: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d'
  });
}

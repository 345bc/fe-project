const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function test() {
  const routes = [
    'http://localhost:8080/tour-details/tours/7',
    'http://localhost:8080/tour-details?tourId=7',
  ];

  for (const r of routes) {
    try {
      const res = await get(r);
      console.log(`\nURL: ${r}`);
      console.log(`Status: ${res.status}`);
      console.log(`Data Code: ${res.data?.code}`);
      console.log(`Data type: ${typeof res.data?.data}`);
      if (res.data?.data) {
        console.log(`Sample: ${JSON.stringify(res.data.data).substring(0, 300)}`);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

test();

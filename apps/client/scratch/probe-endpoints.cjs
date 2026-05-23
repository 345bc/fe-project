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
    'http://localhost:8080/tour-details/tour/7',
    'http://localhost:8080/tour-details/tours/7',
    'http://localhost:8080/tour-details/by-tour/7',
    'http://localhost:8080/tour-details/byTour/7',
    'http://localhost:8080/tour-details?tourId=7',
  ];

  for (const r of routes) {
    try {
      const res = await get(r);
      console.log(`${r} -> status ${res.status}, code: ${res.data?.code}, msg: ${res.data?.message}`);
    } catch (e) {
      console.log(`${r} -> error ${e.message}`);
    }
  }
}

test();

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
  const uuid = '2eab1746-f329-432a-b41e-8c4f975cef0d';
  const urls = [
    `http://localhost:8080/tour-details/${uuid}`,
    `http://localhost:8080/tour-details/uuid/${uuid}`,
  ];

  for (const url of urls) {
    try {
      const res = await get(url);
      console.log(`\nURL: ${url}`);
      console.log(`Status: ${res.status}`);
      console.log(`Data Code: ${res.data?.code}`);
      console.log(`Message: ${res.data?.message}`);
      if (res.data?.data) {
        console.log(`UUID resolved: ${res.data.data.uuid}, ID: ${res.data.data.id}`);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

test();

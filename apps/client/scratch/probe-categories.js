const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const cats = await get('http://localhost:8080/categories');
  console.log('Categories:', JSON.stringify(cats, null, 2));

  const tours = await get('http://localhost:8080/tours');
  console.log('Tours sample (first 1):', JSON.stringify(tours.data?.[0], null, 2));
}

run();

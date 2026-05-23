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
  try {
    const toursRes = await get('http://localhost:8080/tours');
    console.log('--- TOURS ---');
    if (toursRes.data && toursRes.data.data) {
      console.log(`Total tours: ${toursRes.data.data.length}`);
      toursRes.data.data.forEach(t => {
        console.log(`Tour ID: ${t.id}, Name: ${t.name}`);
      });
    }

    const detailsRes = await get('http://localhost:8080/tour-details');
    console.log('\n--- TOUR DETAILS ---');
    if (detailsRes.data && detailsRes.data.data) {
      console.log(`Total tour-details: ${detailsRes.data.data.length}`);
      detailsRes.data.data.forEach(d => {
        console.log(`Detail ID: ${d.id}, Tour ID: ${d.tour?.id}, Tour Name: ${d.tour?.name}`);
      });
    }

    // Let's also test if there is a tour-details/by-tour or similar
    const byTourRes = await get('http://localhost:8080/tour-details/by-tour/7');
    console.log(`\nby-tour/7 status: ${byTourRes.status}`);
  } catch (e) {
    console.error(e);
  }
}

test();

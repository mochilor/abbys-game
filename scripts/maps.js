const fs = require('fs');

const path = './static/maps/';
const listFile = 'maplist.json';

let x = 0;
let y = 0;
let mapsList = {};

for (x = 0; x < 10; x++) {
  for (y = 0; y < 50; y++) {
    let fileName = x + '-' + y + '.json';
    if (fs.existsSync(path + fileName)) {
      mapsList[x + '_' + y] = fileName;
    }
  }
}

const json = JSON.stringify(mapsList, null, 2);

console.log(`${Object.keys(mapsList).length} maps found:`);
console.log(json);

fs.writeFileSync(path + listFile, json);

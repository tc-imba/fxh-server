const bmp = require('./bmp');
const fs = require('fs');

let image_data = Buffer.alloc(320 * 240 * 2);
for (let i = 0; i < image_data.length; i++) {
    image_data[i] = Math.floor(Math.random() * 255);
}

console.log(image_data);

const bmp_data = bmp.bmp(image_data);

console.log(bmp_data);


fs.writeFileSync('test.bmp', bmp_data);

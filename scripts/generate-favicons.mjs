import fs from 'fs';
import sharp from 'sharp';

const svg = fs.readFileSync('public/favicon.svg');

async function generate() {
  await sharp(svg)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');
    
  await sharp(svg)
    .resize(32, 32)
    .png()
    .toFile('public/favicon-32x32.png');
    
  await sharp(svg)
    .resize(16, 16)
    .png()
    .toFile('public/favicon-16x16.png');
    
  console.log('Favicons generated successfully.');
}

generate().catch(console.error);

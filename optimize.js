import sharp from 'sharp';
import path from 'path';

const file = path.join(process.cwd(), 'public/assets/images/Wohnzimmer.jpeg');

Promise.all([
  sharp(file)
    .webp({ quality: 80 })
    .toFile(path.join(process.cwd(), 'public/assets/images/Wohnzimmer.webp'))
    .then(() => console.log('WebP done')),
  sharp(file)
    .avif({ quality: 65 })
    .toFile(path.join(process.cwd(), 'public/assets/images/Wohnzimmer.avif'))
    .then(() => console.log('AVIF done'))
]).catch(err => console.error(err));

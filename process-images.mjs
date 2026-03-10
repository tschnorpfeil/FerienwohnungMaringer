import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGE_DATA_PATH = '/Users/ts/.gemini/antigravity/brain/98f5241a-2e0f-491d-ab9e-a71c88731130/scraped_images.json';
const OUTPUT_DIR = path.join(__dirname, 'public', 'assets', 'images');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Ensure sharp is installed
try {
    execSync('npm list sharp', { stdio: 'ignore' });
} catch (e) {
    console.log("Installing sharp for image processing...");
    execSync('npm install sharp', { stdio: 'inherit' });
}
const sharp = (await import('sharp')).default;

async function downloadAndConvert() {
    const imagesRaw = fs.readFileSync(IMAGE_DATA_PATH, 'utf-8');
    let imageUrls = JSON.parse(imagesRaw);

    // We don't necessarily need all 20+ images. Let's pick a representative 8 for the gallery and 1 for hero.
    const selectedImages = imageUrls.slice(0, 9);

    for (let i = 0; i < selectedImages.length; i++) {
        const url = selectedImages[i];
        const isHero = i === 0;
        const baseName = isHero ? 'hero-bg' : `gallery-${i}`;
        const outputPathWebp = path.join(OUTPUT_DIR, `${baseName}.webp`);

        console.log(`Processing: ${baseName} from ${url}`);

        await new Promise((resolve, reject) => {
            https.get(url, (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
                    return;
                }

                const chunks = [];
                res.on('data', chunk => chunks.push(chunk));
                res.on('end', async () => {
                    const buffer = Buffer.concat(chunks);
                    try {
                        // Convert to webp
                        await sharp(buffer)
                            .webp({ quality: 80 })
                            .toFile(outputPathWebp);
                        console.log(`✓ Saved ${outputPathWebp}`);
                        resolve();
                    } catch (err) {
                        console.error(`Error converting ${url}:`, err);
                        reject(err);
                    }
                });
            }).on('error', reject);
        });
    }

    console.log('Finished processing images!');
}

downloadAndConvert().catch(console.error);

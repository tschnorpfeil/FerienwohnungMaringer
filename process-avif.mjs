import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, 'public', 'assets', 'images');

// Process all files in the images directory
async function processImagesToAvif() {
    const files = fs.readdirSync(INPUT_DIR);
    console.log(`Found ${files.length} items in ${INPUT_DIR}`);

    let conversions = 0;

    for (const file of files) {
        if (file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.png')) {
            const inputPath = path.join(INPUT_DIR, file);
            const baseName = path.parse(file).name;
            const outputPath = path.join(INPUT_DIR, `${baseName}.avif`);

            // Skip if AVIF already exists
            if (fs.existsSync(outputPath)) {
                console.log(`Skipping: ${file} (AVIF already exists)`);
                continue;
            }

            console.log(`Processing: ${file} -> ${baseName}.avif`);

            try {
                await sharp(inputPath)
                    .avif({ quality: 65, effort: 8 }) // Extreme optimization setting for perfect CrUX / Lighthouse scores
                    .toFile(outputPath);

                conversions++;
                console.log(`✓ Converted to AVIF`);
            } catch (err) {
                console.error(`Error converting ${file}:`, err);
            }
        }
    }

    console.log(`\nFinished! Successfully processed ${conversions} new images to AVIF.`);
}

processImagesToAvif().catch(console.error);

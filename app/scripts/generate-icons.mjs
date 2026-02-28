// scripts/generate-icons.mjs
// Source: sharp.pixelplumbing.com
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '../public')

async function generateIcons() {
  const inputSvg = path.join(publicDir, 'icon.svg')

  // Apple touch icon — 180x180
  await sharp(inputSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'))

  // Standard PWA icons
  await sharp(inputSvg).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'))
  await sharp(inputSvg).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'))

  console.log('Icons generated successfully')
}

generateIcons().catch(console.error)

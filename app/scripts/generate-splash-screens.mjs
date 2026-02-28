// scripts/generate-splash-screens.mjs
// Generates Apple iOS splash screen PNGs for all major device/orientation combos
// Uses sharp@0.32.x which supports Node 18.12.0
// Device list sourced from: yesviz.com + Apple HIG device specs
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '../public')
const inputSvg = path.join(publicDir, 'icon.svg')

// Background color for splash screens (surface color from design system)
const BG_COLOR = { r: 15, g: 23, b: 42, alpha: 1 } // #0F172A

// Apple device splash screen specs
// format: [width, height, deviceWidth, deviceHeight, dpr, deviceName]
const DEVICES = [
  // iPhone SE (1st gen), 5, 5s, 5c
  [640,  1136, 320, 568, 2, 'iphone5'],
  // iPhone 6, 6s, 7, 8, SE (2nd/3rd gen)
  [750,  1334, 375, 667, 2, 'iphone6'],
  // iPhone 6 Plus, 7 Plus, 8 Plus
  [1242, 2208, 414, 736, 3, 'iphoneplus'],
  // iPhone X, XS, 11 Pro, 12 Mini, 13 Mini
  [1125, 2436, 375, 812, 3, 'iphonex'],
  // iPhone XS Max, 11 Pro Max
  [1242, 2688, 414, 896, 3, 'iphonexsmax'],
  // iPhone XR, 11
  [828,  1792, 414, 896, 2, 'iphone11'],
  // iPhone 12, 12 Pro, 13, 13 Pro, 14
  [1170, 2532, 390, 844, 3, 'iphone12'],
  // iPhone 12 Pro Max, 13 Pro Max, 14 Plus
  [1284, 2778, 428, 926, 3, 'iphone12promax'],
  // iPhone 14 Pro
  [1179, 2556, 393, 852, 3, 'iphone14pro'],
  // iPhone 14 Pro Max
  [1290, 2796, 430, 932, 3, 'iphone14promax'],
  // iPad Mini (5th+)
  [1536, 2048, 768, 1024, 2, 'ipadmini'],
  // iPad Air (3rd+)
  [1668, 2224, 834, 1112, 2, 'ipadair'],
  // iPad Pro 11"
  [1668, 2388, 834, 1194, 2, 'ipadpro11'],
  // iPad Pro 12.9"
  [2048, 2732, 1024, 1366, 2, 'ipadpro129'],
]

async function createSplashScreen(width, height) {
  // Icon occupies 40% of the smaller dimension (with 30% padding = 40% icon)
  const iconSize = Math.round(Math.min(width, height) * 0.4)

  // Generate icon PNG buffer at target size
  const iconBuffer = await sharp(inputSvg)
    .resize(iconSize, iconSize, { fit: 'contain', background: BG_COLOR })
    .png()
    .toBuffer()

  // Create full-size background with icon centered
  const x = Math.round((width - iconSize) / 2)
  const y = Math.round((height - iconSize) / 2)

  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: BG_COLOR
    }
  })
    .composite([{ input: iconBuffer, left: x, top: y }])
    .png()
    .toBuffer()
}

async function generateSplashScreens() {
  const linkTags = []

  for (const [w, h, dw, dh, dpr, name] of DEVICES) {
    // Portrait
    const portraitFile = `apple-splash-${w}-${h}.png`
    const portraitPath = path.join(publicDir, portraitFile)
    const portraitBuf = await createSplashScreen(w, h)
    fs.writeFileSync(portraitPath, portraitBuf)
    linkTags.push(
      `<link rel="apple-touch-startup-image" href="/${portraitFile}" media="(device-width: ${dw}px) and (device-height: ${dh}px) and (-webkit-device-pixel-ratio: ${dpr}) and (orientation: portrait)" />`
    )

    // Landscape (swap dimensions)
    const landscapeFile = `apple-splash-${h}-${w}.png`
    const landscapePath = path.join(publicDir, landscapeFile)
    const landscapeBuf = await createSplashScreen(h, w)
    fs.writeFileSync(landscapePath, landscapeBuf)
    linkTags.push(
      `<link rel="apple-touch-startup-image" href="/${landscapeFile}" media="(device-width: ${dw}px) and (device-height: ${dh}px) and (-webkit-device-pixel-ratio: ${dpr}) and (orientation: landscape)" />`
    )

    process.stdout.write(`  Generated: ${name} portrait (${w}x${h}) + landscape (${h}x${w})\n`)
  }

  console.log('\n=== LINK TAGS FOR index.html ===\n')
  console.log(linkTags.join('\n'))
  console.log('\n=== END LINK TAGS ===\n')
  console.log(`Splash screens generated: ${DEVICES.length * 2} files`)

  return linkTags
}

generateSplashScreens().catch(console.error)

import {
  combinePresetAndAppleSplashScreens,
  defineConfig,
  minimal2023Preset
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: combinePresetAndAppleSplashScreens(
    minimal2023Preset,
    {
      padding: 0.3,
      resizeOptions: {
        background: '#0F172A',
        fit: 'contain'
      },
      linkMediaOptions: {
        log: true,
        addMediaScreen: true,
        basePath: '/',
        xhtml: false
      }
    }
    // No device filter = generates for ALL devices including iPhone 11
  ),
  images: ['public/icon.svg']
})

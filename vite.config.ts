import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    base: env.VITE_ASSETS_BASE ?? '/',
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss()
    ],
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/scripts.js',
          chunkFileNames: 'assets/chunk-[name]-[hash].js',
          assetFileNames: (info) =>
            info.names.some((name) => name.endsWith('.css'))
              ? 'assets/scripts.css'
              : 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})

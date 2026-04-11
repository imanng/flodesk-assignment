import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    alias: {
      '@flodesk/grain': path.resolve(__dirname, './src/test/mocks/grain.tsx'),
    },
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})

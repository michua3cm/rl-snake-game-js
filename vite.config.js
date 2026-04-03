import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8888,
    open: true
  },
  base: '/rl-snake-game-js/',
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
    coverage: {
      provider: 'v8',
      include: [
        'src/components/game_env/**',
        'src/components/agents/**',
        'src/components/*.jsx',
        'src/hooks/**'
      ]
    }
  }
})

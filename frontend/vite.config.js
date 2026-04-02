import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/drivers': 'http://f1.local',
      '/races': 'http://f1.local',
      '/teams': 'http://f1.local',
      '/favorites': 'http://f1.local',
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      // '/backend/routes' : {
      //   target: 'http:localhost:8080',
      //   secure: false
      '/api': 'http://localhost:8080',
      }
    }
  }
)

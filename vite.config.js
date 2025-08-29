import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Para acceder desde red interna
    open: true,
    proxy: {
      '/api': {
        target: 'http://192.168.11.7:3010',
        changeOrigin: true,
        secure: false,
      },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  },
  define: {
    // Variables de entorno para producción
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  }
    }
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Redirige todas las solicitudes que comiencen con /api/riot al servidor de Riot
      '/api/riot': {
        // Apuntamos al cluster global (puedes cambiarlo si es necesario)
        target: 'https://americas.api.riotgames.com', 
        changeOrigin: true,
        // Reescribimos la ruta: /api/riot/foo -> /foo
        rewrite: (path) => path.replace(/^\/api\/riot/, ''),
        // Aseguramos que la clave de API (si se pasa en headers) se reenvíe
        secure: false, 
      },
      // 🛑 Proxy para las URLs de Plataforma (LA2, NA1, etc.)
      '/api/platform': {
        // Apuntamos a un placeholder, la cambiaremos dinámicamente si es necesario
        // Pero como tus llamadas ya están divididas, podemos hacer esto:
        target: 'https://la2.api.riotgames.com', // ⬅️ CAMBIA ESTO A TU REGIÓN BASE
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/platform/, ''),
        secure: false,
      }
    }
  }
})

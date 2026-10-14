import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const usePolling = env.VITE_DEV_USE_POLLING === 'true'

  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: './src/routes',
        generatedRouteTree: './src/routeTree.gen.ts',
        routeFileIgnorePrefix: '-',
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      watch: usePolling ? { usePolling: true, interval: 300 } : undefined,
      proxy: {
        '/api': {
          target: env.VITE_DEV_API_PROXY_TARGET ?? 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: true,
      port: 4173,
    },
    build: {
      target: 'es2023',
      sourcemap: false,
    },
  }
})

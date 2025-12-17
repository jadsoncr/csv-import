import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Configuração do Vite para BRO.AI
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
});


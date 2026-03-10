import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        parken: resolve(__dirname, 'spokes/cochem-parken.html'),
        hund: resolve(__dirname, 'spokes/ferienwohnung-cochem-mit-hund.html'),
        wetter: resolve(__dirname, 'spokes/wetter-cochem-beste-reisezeit.html'),
        restaurants: resolve(__dirname, 'spokes/restaurants-weingueter-cochem.html'),
        reichsburg: resolve(__dirname, 'spokes/reichsburg-cochem-tickets-fuhrung.html')
      }
    }
  }
});

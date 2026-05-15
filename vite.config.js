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
        en: resolve(__dirname, 'en/index.html'),
        fr: resolve(__dirname, 'fr/index.html'),
        nl: resolve(__dirname, 'nl/index.html'),
        parken: resolve(__dirname, 'spokes/cochem-parken.html'),
        hund: resolve(__dirname, 'spokes/ferienwohnung-cochem-mit-hund.html'),
        wetter: resolve(__dirname, 'spokes/wetter-cochem-beste-reisezeit.html'),
        restaurants: resolve(__dirname, 'spokes/restaurants-weingueter-cochem.html'),
        reichsburg: resolve(__dirname, 'spokes/reichsburg-cochem-tickets-fuhrung.html'),
        ueberuns: resolve(__dirname, 'spokes/ueber-uns-gastgeber.html'),
        burgblick: resolve(__dirname, 'spokes/ferienwohnung-cochem-burgblick.html'),
        parkplatz: resolve(__dirname, 'spokes/ferienwohnung-cochem-parkplatz.html'),
        wandern: resolve(__dirname, 'spokes/wandern-cochem-mosel.html')
      }
    }
  }
});

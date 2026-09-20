import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    rollupOptions: {
      output: {
        // Big third-party libraries get their own long-lived chunks so a code change
        // in the app doesn't force everyone to re-download React or the animation library.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) return 'vendor-motion';
          if (id.includes('@tiptap') || id.includes('prosemirror')) return 'vendor-editor';
          if (id.includes('@headlessui') || id.includes('@heroicons')) return 'vendor-ui';
          if (id.includes('@tanstack')) return 'vendor-query';
          if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/') || id.includes('scheduler')) return 'vendor-react';
          return undefined;
        }
      }
    }
  }
})

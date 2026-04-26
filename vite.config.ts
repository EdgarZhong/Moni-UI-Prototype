import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@bootstrap', replacement: path.resolve(__dirname, 'src/bootstrap') },
      { find: '@logic', replacement: path.resolve(__dirname, 'src/logic') },
      { find: '@ui', replacement: path.resolve(__dirname, 'src/ui') },
      { find: '@system', replacement: path.resolve(__dirname, 'src/system') },
      { find: '@shared', replacement: path.resolve(__dirname, 'src/shared') },
      { find: '@capacitor/core', replacement: path.resolve(__dirname, 'src/system/mocks/capacitor-core.ts') },
      { find: '@capacitor/keyboard', replacement: path.resolve(__dirname, 'src/system/mocks/capacitor-keyboard.ts') },
    ],
  },
});

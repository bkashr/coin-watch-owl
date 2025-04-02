import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
<<<<<<< HEAD
export default defineConfig({
  plugins: [react()],
=======
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
>>>>>>> d008fd004d969d09894b64d4d2247ff805d8217a
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
<<<<<<< HEAD
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        background: path.resolve(__dirname, 'src/background.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return '[name].[ext]';
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
            return `icons/[name].[ext]`;
          }
          return `[name].[ext]`;
        },
      },
    },
    minify: false,
    sourcemap: true,
  },
  server: {
    port: 5173,
  },
  base: './', // This ensures assets are loaded correctly in the extension
});
=======
}));
>>>>>>> d008fd004d969d09894b64d4d2247ff805d8217a

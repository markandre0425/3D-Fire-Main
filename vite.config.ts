import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import glsl from "vite-plugin-glsl";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    glsl(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      // Force all Three.js imports to use the same instance
      "three": path.resolve(__dirname, "node_modules/three"),
      // Ensure React is always resolved from the root node_modules
      "react": path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["three", "react", "react-dom"],
    force: true,
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    commonjsOptions: {
      include: [/three/, /node_modules/],
    },
  },
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.mp3", "**/*.ogg", "**/*.wav"],
  server: {
    hmr: {
      overlay: true
    },
    fs: {
      allow: [
        path.resolve(__dirname, "client"),
        path.resolve(__dirname, "node_modules"),
        path.resolve(__dirname, "shared")
      ]
    }
  }
});


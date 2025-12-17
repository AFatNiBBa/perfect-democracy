
import solidPlugin from "@seanalunni/vite-plugin-solid";
import { defineConfig } from "vite";
import { join } from "path";

const root = join(import.meta.dirname, "src");
const target = "ESNext";

export default defineConfig({
  root,
  plugins: [ solidPlugin() ],
  server: { port: 80 },
  esbuild: { target },
  optimizeDeps: {
    esbuildOptions: { target }
  },
  build: {
    target,
    rollupOptions: {
      input: join(root, "index.html")
    }
  },
});
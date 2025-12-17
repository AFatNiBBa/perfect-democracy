
import solidPlugin from "@seanalunni/vite-plugin-solid";
import { join } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [ solidPlugin() ],
  server: { port: 80 },
  build: {
    target: "esnext",
    rollupOptions: {
      input: join(import.meta.dirname, "src/index.html")
    }
  },
});
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: process.env.GITHUB_ACTIONS ? "/Dogu/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@dogu": fileURLToPath(new URL("../src", import.meta.url)),
    },
  },
  build: {
    outDir: fileURLToPath(new URL("../playground-dist", import.meta.url)),
    emptyOutDir: true,
  },
});

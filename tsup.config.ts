import { defineConfig } from "tsup";

const entries = [
  "src/index.ts",
  "src/array/index.ts",
  "src/object/index.ts",
  "src/string/index.ts",
  "src/number/index.ts",
  "src/date/index.ts",
  "src/async/index.ts",
  "src/function/index.ts",
  "src/type/index.ts",
  "src/url/index.ts",
  "src/browser/index.ts",
  "src/storage/index.ts",
  "src/css/index.ts",
  "src/tree/index.ts",
];

export default defineConfig({
  entry: entries,
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2020",
  outDir: "dist",
});

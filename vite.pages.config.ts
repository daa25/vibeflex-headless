import { defineConfig, mergeConfig } from "vite";
import baseConfig from "./vite.config";

export default defineConfig((env) =>
  mergeConfig(
    typeof baseConfig === "function" ? baseConfig(env) : baseConfig,
    {
      base: "/vibeflex-headless/",
      build: {
        outDir: "dist/pages",
        emptyOutDir: true,
      },
    },
  ),
);

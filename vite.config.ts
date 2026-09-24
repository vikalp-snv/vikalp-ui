import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],

  build: {
    lib: {
      entry: "src/index.ts",
      name: "VikalpUI",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      cssFileName: "styles",
    },

    rollupOptions: {
      external: (id) => id === "react" || id.startsWith("react/"),
    },
  },
});
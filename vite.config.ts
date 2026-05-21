import { defineConfig } from "vitest/config";
import tailwindcss from '@tailwindcss/vite'
import react from v";
import path from "path";

export default defineConfig({
  plugins: [ tailwindcss(),
    react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});



import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr({ include: "**/*.svg?react" })],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // node_modules 내의 모듈을 청크로 분리
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        },
        // 청크 파일 이름을 'chunk-[hash].js'로 지정
        chunkFileNames: "js/chunk-[hash].js",
        // 엔트리 파일 이름을 'entry-[hash].js'로 지정
        entryFileNames: "js/entry-[hash].js",
        // CSS 파일 이름을 'style-[hash].css'로 지정
        assetFileNames: ({ name }) => {
          if (name && name.endsWith(".css")) {
            return "css/style-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), "src/$1"),
      },
    ],
  },
  server: {
    port: 8080,
  },
  preview: {
    port: 8080,
  },
});

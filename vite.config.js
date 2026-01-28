// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwind from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwind()],
//   server: {
//     port: 4000,
//     proxy: {
//       "/api": {
//         target: "http://localhost:3000",
//         changeOrigin: true,
//       },
//       "/p": {
//         target: "http://localhost:3000",
//         changeOrigin: true,
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwind()],
  appType: "spa",
  server: {
    port: 4000,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/p": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});

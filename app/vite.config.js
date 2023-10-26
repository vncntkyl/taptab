import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
7;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Taptab Application",
        short_name: "Taptab App",
        description: "Taptab Application",
        background_color: "#eaecef",
        theme_color: "#eaecef",
        display: "standalone",
        orientation: "landscape",
        start_url: "/",
        icons: [
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
    // mkcert(),
  ],
  server: {
    // https: true,
    port: 4040,
  },
});

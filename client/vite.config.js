import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Silence Squarespace analytics endpoints when running the legacy preview in dev.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith("/api/census/")) {
          res.statusCode = 204;
          res.end();
          return;
        }
        next();
      });
    },
  },
});

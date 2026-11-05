// Solo para exponer el dev server por Tailscale Funnel (no se usa en build/deploy).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: { server: { entry: "server" } },
  vite: { server: { allowedHosts: [".ts.net"] } },
});

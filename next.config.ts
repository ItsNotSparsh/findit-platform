import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // This app is nested inside the Git worktree. Anchor Turbopack to this config
  // file so its root does not depend on the terminal's current directory.
  turbopack: {
    root: appRoot,
  },
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    // update these if your LAN IP changes
    "http://10.12.49.160:3000",
  ],
};

export default nextConfig;

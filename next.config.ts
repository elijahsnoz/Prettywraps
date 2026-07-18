import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root. Without this, Next walks up and finds an unrelated
  // lockfile in the home directory and infers the wrong root.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

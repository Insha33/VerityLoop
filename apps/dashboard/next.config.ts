import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  // Builds use webpack; without this, Server Components would bundle every Astryx component.
  experimental: { optimizePackageImports: ["@astryxdesign/core"] },
};

export default nextConfig;

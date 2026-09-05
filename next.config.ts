import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  allowedDevOrigins: ["192.168.0.3", "localhost", "127.0.0.1"],
  output: "export",
  trailingSlash: true,
};

export default nextConfig;

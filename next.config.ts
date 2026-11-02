import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/chat": ["./knowledge-base/**/*"],
  },
};

export default nextConfig;

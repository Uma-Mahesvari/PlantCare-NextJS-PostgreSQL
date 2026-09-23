import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the development server to serve Next.js HMR resources when the
  // website is opened from another device on this local network.
  allowedDevOrigins: ["192.168.1.2"],
};

export default nextConfig;

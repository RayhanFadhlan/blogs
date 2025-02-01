import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "backend",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        port: '',
        hostname: "api.blogs.rayhanfa.me",
        pathname: "/uploads/**",
      }, 
    ],
  },
};

export default nextConfig;

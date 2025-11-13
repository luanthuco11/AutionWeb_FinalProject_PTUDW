import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["images.unsplash.com", "encrypted-tbn0.gstatic.com", "ichef.bbci.co.uk"], 
  },
};

export default nextConfig;

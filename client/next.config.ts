import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            }
        ]
    },
    turbopack: {
        root: path.resolve(__dirname, "..")
    }
};

export default nextConfig;

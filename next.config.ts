import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "nyc3.digitaloceanspaces.com",
      "sfo3.digitaloceanspaces.com",
      "res.cloudinary.com"
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
<<<<<<< Updated upstream
=======
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "ftp.goit.study",
        pathname: "/**",
>>>>>>> Stashed changes
      },
    ],
  },
};

export default nextConfig;

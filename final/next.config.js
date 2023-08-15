/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  experimental: {
    esmExternals: false, // THIS IS THE FLAG THAT MATTERS
    serverActions: true,
  },
};

module.exports = nextConfig;

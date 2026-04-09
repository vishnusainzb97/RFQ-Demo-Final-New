/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/RFQ-Chemveda-Demo',
  assetPrefix: '/RFQ-Chemveda-Demo/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

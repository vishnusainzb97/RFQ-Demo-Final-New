/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/RFQ-Demo-Final-New',
  assetPrefix: '/RFQ-Demo-Final-New/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

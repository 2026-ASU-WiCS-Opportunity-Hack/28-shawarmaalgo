import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp']
  }
};

export default nextConfig;

initOpenNextCloudflareForDev();

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Para deploy no Netlify, usar standalone output
  // Se usar @netlify/plugin-nextjs, pode trocar para não-standalone
  output: "standalone",
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  reactStrictMode: false,
  
  // Imagens - configurar domínios externos se necessário
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { 
            key: "Content-Security-Policy", 
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.googleapis.com https://www.gstatic.com challenges.cloudflare.com static.cloudflareinsights.com vercel.live https://www.googletagmanager.com https://apis.google.com https://*.google.com https://*.firebaseapp.com;",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.cloudflare.com https://*.google.com;",
              "font-src 'self' data: https://fonts.gstatic.com;",
              "img-src 'self' data: https://*.googleusercontent.com https://challenges.cloudflare.com https://www.google-analytics.com https://www.googletagmanager.com;",
              "frame-src 'self' challenges.cloudflare.com vercel.live https://*.firebaseapp.com https://*.google.com;",
              "connect-src 'self' https://*.googleapis.com https://*.cloudfunctions.net challenges.cloudflare.com static.cloudflareinsights.com ws://localhost:* https://*.google-analytics.com https://stats.g.doubleclick.net https://*.firebaseio.com vercel.live;",
            ].join(' ')
          }
        ]
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;

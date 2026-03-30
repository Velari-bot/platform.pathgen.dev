import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/v1/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://platform.pathgen.dev" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ]
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { 
            key: "Content-Security-Policy", 
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' challenges.cloudflare.com static.cloudflareinsights.com https://*.googleapis.com https://www.gstatic.com;",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.cloudflare.com;",
              "font-src 'self' data: https://fonts.gstatic.com;",
              "img-src 'self' data: https://*.googleusercontent.com https://challenges.cloudflare.com;",
              "frame-src 'self' challenges.cloudflare.com;",
              "connect-src 'self' https://*.googleapis.com https://*.cloudfunctions.net https://challenges.cloudflare.com static.cloudflareinsights.com ws://localhost:*; ",
            ].join(' ')
          }
        ]
      },
      {
        source: "/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
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

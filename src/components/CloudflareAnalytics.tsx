import React from 'react';

/**
 * Cloudflare Web Analytics (Manual-injection)
 * Add your token from the Cloudflare Dashboard (Analytics > Web Analytics)
 * to your .env file as CLOUDFLARE_ANALYTICS_TOKEN
 */
const CloudflareAnalytics = () => {
  const token = process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;
  
  if (!token) return null;
  
  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={`{"token": "${token}"}`}
    />
  );
};

export default CloudflareAnalytics;

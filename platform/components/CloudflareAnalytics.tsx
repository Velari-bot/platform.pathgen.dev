import React from 'react';

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

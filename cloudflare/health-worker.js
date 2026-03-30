/**
 * PathGen Edge Health Check Worker
 * Deploy this to status.pathgen.dev or api.pathgen.dev/health
 */
export default {
  async fetch(request, env, ctx) {
    const healthData = {
      status: "operational",
      edge_node: request.cf?.colo || "UNKNOWN", // Shows which city responded
      country: request.cf?.country || "UNKNOWN",
      timestamp: new Date().toISOString(),
      service: "Pathgen Universal API",
      version: "1.0.0",
      ip: request.headers.get("cf-connecting-ip") || "0.0.0.0"
    };

    return new Response(JSON.stringify(healthData, null, 2), {
      status: 200,
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
        "X-Edge-Source": "Cloudflare-Worker"
      },
    });
  },
};

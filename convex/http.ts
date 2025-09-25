import { httpRouter } from "convex/server";
import { triggerN8nWorkflow, handleN8nCallback, healthCheck } from "./n8n.node";

const http = httpRouter();

// n8n integration endpoints
http.route({
  path: "/triggerN8nWorkflow",
  method: "POST",
  handler: triggerN8nWorkflow,
});

http.route({
  path: "/handleN8nCallback", 
  method: "POST",
  handler: handleN8nCallback,
});

// Health check
http.route({
  path: "/health",
  method: "GET", 
  handler: healthCheck,
});

export default http;
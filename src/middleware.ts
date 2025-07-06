import { defineMiddleware } from "astro:middleware";
import { LRUCache } from "lru-cache";

type LimitRule = {
  max: number; //Peticiones máximas permitidas
  ttl: number; // Tiempo de vida de la regla en milisegundos
};

const rules: Record<string, LimitRule> = {
  "/api/email": { max: 1, ttl: 60000 },
  "/api/emp-log": { max: 3, ttl: 60000 },
};

const limiterMap = new Map<string, LRUCache<string, number>>();

function getRule(path: string): LimitRule | null {
  for (const [prefix, rule] of Object.entries(rules)) {
    if (path.startsWith(prefix)) return rule;
  }
  return null;
}

/**
 * Middleware to redirect users from the /emp-log page to /admin
 * if they have valid access and refresh tokens in cookies.
 * @param context - Object containing all information about the request.
 * @param next - Function to call the next middleware in the chain.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, url, redirect } = context;
  const ip = context.clientAddress || "unknown";
  const path = url.pathname;

  const rule = getRule(path);
  if (!rule) return next();

  // Initialize or get the cache for the current path
  if (!limiterMap.has(path)) {
    limiterMap.set(
      path,
      new LRUCache<string, number>({
        max: rule.max,
        ttl: rule.ttl,
      })
    );
  }

  const limiter = limiterMap.get(path)!;
  const current = limiter.get(ip) || 0;

  if (current >= rule.max) {
    console.warn(`Rate limit exceeded for ${ip} on ${path}`);
    return new Response("Too many requests", { status: 429 });
  }

  limiter.set(ip, current + 1);

  if (url.pathname === "/emp-log") {
    const accessToken = cookies.get("sb-access-token");
    const refreshToken = cookies.get("sb-refresh-token");

    if (accessToken && refreshToken) {
      return redirect("/admin");
    }
  }

  return next();
});

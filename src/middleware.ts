import { defineMiddleware } from "astro:middleware";

/**
 * Middleware to redirect users from the /emp-log page to /admin
 * if they have valid access and refresh tokens in cookies.
 * @param context - Object containing all information about the request.
 * @param next - Function to call the next middleware in the chain.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, url, redirect } = context;

  if (url.pathname === "/emp-log") {
    const accessToken = cookies.get("sb-access-token");
    const refreshToken = cookies.get("sb-refresh-token");

    if (accessToken && refreshToken) {
      return redirect("/admin");
    }
  }

  return next();
});

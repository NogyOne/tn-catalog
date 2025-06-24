import { supabase } from "@/db/supabaseClient";
import type { APIContext } from "astro";

export async function authRedirect(
  Astro: APIContext,
  redirectUrl: string = "/404"
) {
  const accessToken = Astro.cookies.get("sb-access-token");
  const refreshToken = Astro.cookies.get("sb-refresh-token");

  if (!accessToken || !refreshToken) {
    return Astro.redirect(redirectUrl);
  }

  try {
    const { data, error } = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });
    if (error) {
      Astro.cookies.delete("sb-access-token", {
        path: "/",
      });
      Astro.cookies.delete("sb-refresh-token", {
        path: "/",
      });
      return Astro.redirect("/");
    }

    return { data };
  } catch (error) {
    Astro.cookies.delete("sb-access-token", {
      path: "/404",
    });
    Astro.cookies.delete("sb-refresh-token", {
      path: "/404",
    });
    return Astro.redirect("/emp-log");
  }

  // const email = session.data.user?.email;
}

// lib/authMiddleware.ts
import { createServerClient } from "@supabase/ssr";
import type { APIContext } from "astro";

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthMiddlewareResult {
  user: AuthUser | null;
  error: string | null;
}

/**
 * Middleware de autenticación, verifica si el usuario está autenticado
 * @param context - Contexto de la API de Astro
 * @returns Promise con el usuario autenticado o error
 */
export async function authMiddleware(
  context: APIContext
): Promise<AuthMiddlewareResult> {
  const { cookies } = context;

  try {
    // Verificar si existen las cookies de autenticación
    const accessToken = cookies.get("sb-access-token")?.value;
    const refreshToken = cookies.get("sb-refresh-token")?.value;

    // Si no hay tokens, el usuario no está autenticado
    if (!accessToken) {
      return { user: null, error: "Usuario no autenticado" };
    }

    // Crear cliente de Supabase para verificar el token
    const supabase = createServerClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            if (name === "sb-access-token") return accessToken;
            if (name === "sb-refresh-token") return refreshToken;
            return cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookies.set(name, value, options);
          },
          remove(name: string, options: any) {
            cookies.delete(name, options);
          },
        },
      }
    );

    // Verificar el usuario actual con el token
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      console.error("Error verificando usuario:", userError);
      return { user: null, error: "Token inválido o expirado" };
    }

    // Retornar información del usuario
    const authUser: AuthUser = {
      id: user.id,
      email: user.email || "",
    };

    return { user: authUser, error: null };
  } catch (error) {
    console.error("Error en authMiddleware:", error);
    return { user: null, error: "Error interno de autenticación" };
  }
}

/**
 * Wrapper para proteger endpoints que requieren autenticación
 * @param handler - Función del endpoint que recibe el usuario autenticado
 * @returns Función del endpoint de Astro
 */
export function requireAuth<T>(
  handler: (context: APIContext, user: AuthUser) => Promise<Response> | Response
) {
  return async (context: APIContext): Promise<Response> => {
    const { user, error } = await authMiddleware(context);

    if (!user || error) {
      return new Response(
        JSON.stringify({
          code: "[FORBIDDEN]: Not authorized",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Llamar al handler original con el usuario autenticado
    return handler(context, user);
  };
}

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set({ name, value, ...options }),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 1. Obtener el usuario actual directamente
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Si intenta entrar a /admin, aplicar las reglas estrictas
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Si no está logueado, al login
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Consultar el perfil saltándonos el RLS de manera segura en el middleware
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // Si hubo error o el rol no es admin, rebote fulminante
    if (error || profile?.role !== "admin") {
      console.log(
        "🔒 Acceso denegado. Rol encontrado:",
        profile?.role,
        "Error:",
        error?.message,
      );
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import { login } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-neutral-900 p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Ingresa a tu cuenta
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Introduce tus credenciales para acceder
          </p>
        </div>

        <form action={login} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-neutral-500 text-sm"
              placeholder="tu@email.com"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-neutral-500 text-sm"
              placeholder="••••••••"
            />
          </div>

          {/* Banner de alerta si hay un mensaje de éxito (ej. confirmar correo) */}
          {message && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-lg border border-emerald-200 dark:border-emerald-900/50">
              {message}
            </div>
          )}

          {/* Banner de alerta si hay un error de autenticación */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-500 text-xs rounded-lg border border-red-200 dark:border-red-900/50">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="text-center text-xs text-neutral-500">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="underline font-medium text-neutral-900 dark:text-neutral-50"
          >
            Regístrate aquí
          </a>
        </div>
      </div>
    </div>
  );
}

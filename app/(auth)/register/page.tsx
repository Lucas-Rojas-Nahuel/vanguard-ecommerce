import { signup } from "../actions";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-neutral-900 p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Crea tu cuenta</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Regístrate para empezar a comprar
          </p>
        </div>

        <form action={signup} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="fullName" className="text-sm font-medium">
              Nombre Completo
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-neutral-500 text-sm"
              placeholder="John Doe"
            />
          </div>

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
              minLength={6}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-neutral-500 text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-500 text-xs rounded-lg border border-red-200 dark:border-red-900/50">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
          >
            Registrarse
          </button>
        </form>

        <div className="text-center text-xs text-neutral-500">
          ¿Ya tienes cuenta?{" "}
          <a
            href="/login"
            className="underline font-medium text-neutral-900 dark:text-neutral-50"
          >
            Inicia sesión
          </a>
        </div>
      </div>
    </div>
  );
}

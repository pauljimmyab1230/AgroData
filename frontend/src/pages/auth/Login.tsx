import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Error al iniciar sesión. Verifica tus credenciales.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest-50 via-white to-forest-50/50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-600 to-forest-400 shadow-lg shadow-forest-600/30">
            <Sprout className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Bienvenido</h1>
          <p className="mt-1 text-sm text-gray-500">Inicia sesión en tu cuenta de AgroData</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm text-[#111827] outline-none transition-all placeholder:text-gray-400 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm text-[#111827] outline-none transition-all placeholder:text-gray-400 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-forest-600 to-forest-400 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-forest-600/25 transition-all hover:shadow-lg hover:shadow-forest-600/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="font-semibold text-forest-600 transition-colors hover:text-forest-700"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

import { useState, useCallback, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {
  Sprout,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface ApiErrorResponse {
  message?: string;
  detail?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");

      if (!email.trim() || !password) {
        setError("Ingresa tu correo y contraseña");
        return;
      }

      setLoading(true);
      try {
        await login(email.trim(), password);
        navigate("/", { replace: true });
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          const data = err.response?.data as ApiErrorResponse | undefined;
          setError(
            data?.detail || data?.message ||
              "Error al iniciar sesión. Verifica tus credenciales."
          );
        } else {
          setError("Error al iniciar sesión. Verifica tus credenciales.");
        }
      } finally {
        setLoading(false);
      }
    },
    [email, password, login, navigate]
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A4174] via-[#001D39] to-[#001D39] px-4 py-10">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#0A4174]/30 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#49769F]/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute right-10 top-20 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-blue-900/20">
          <div className="px-8 py-8">
            <div className="mb-6 flex justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0A4174] text-white shadow-lg shadow-[#0A4174]/40 p-2">
                <Sprout className="h-9 w-9" strokeWidth={1.5} />
              </span>
            </div>

            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
            </div>

            {error && (
              <div
                className="mb-6 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#0A4174] focus:bg-white focus:ring-2 focus:ring-[#0A4174]/20"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-11 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#0A4174] focus:bg-white focus:ring-2 focus:ring-[#0A4174]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0A4174] to-[#001D39] py-3 text-sm font-semibold text-white shadow-lg shadow-[#0A4174]/30 transition-all hover:from-[#001D39] hover:to-[#001D39] hover:shadow-xl hover:shadow-[#0A4174]/40 active:from-[#001D39] active:to-[#001D39] disabled:pointer-events-none disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

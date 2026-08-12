import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sprout,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Leaf,
  Users,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const features = [
  {
    icon: Users,
    title: "Gestión de productores",
    description: "Centraliza la información de tus socios y parcelas.",
  },
  {
    icon: Leaf,
    title: "Trazabilidad completa",
    description: "Sigue cada cultivo, campaña y lote de principio a fin.",
  },
  {
    icon: TrendingUp,
    title: "Decisiones con datos",
    description: "KPIs y reportes claros para el campo y la planta.",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = "Ingresa tu correo electrónico";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Ingresa un correo válido";
    }
    if (!password) {
      errors.password = "Ingresa tu contraseña";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!validate()) return;

    setLoading(true);
    try {
      await login(email.trim(), password);
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

  const handleForgot = () => {
    setInfo("Contacta al administrador del sistema para restablecer tu contraseña.");
  };

  const inputBase =
    "w-full rounded-lg border bg-white py-2.5 pl-11 pr-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-gray-400 focus:ring-2";
  const inputNormal = "border-gray-300 focus:border-forest-600 focus:ring-forest-600/20";
  const inputError = "border-red-300 focus:border-red-500 focus:ring-red-500/20";

  return (
    <div className="flex min-h-screen bg-white">
      {/* ── Panel de marca ─────────────────────────────────── */}
      <aside className="hidden w-1/2 flex-col bg-forest-900 lg:flex">
        <div className="flex flex-1 flex-col justify-between p-10 xl:p-14">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-600 text-white">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight text-white">AgroData</span>
          </div>

          <div className="max-w-lg">
            <h2 className="font-display text-4xl font-semibold leading-tight text-white xl:text-5xl">
              El campo, conectado a cada decisión
            </h2>
            <p className="mt-5 text-base leading-relaxed text-forest-100/80 xl:text-lg">
              Gestiona productores, parcelas, campañas, inspecciones y toda la trazabilidad de tu
              cooperativa agrícola en una sola plataforma.
            </p>

            <ul className="mt-10 space-y-5">
              {features.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest-800 text-forest-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-0.5 text-sm text-forest-100/70">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 border border-white/10 bg-forest-800 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-forest-700 text-forest-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-sm text-forest-100/85">
              <span className="font-semibold text-white">Trazabilidad certificada</span>
              <br />
              Cumple estándares de calidad desde el cultivo hasta el lote final.
            </p>
          </div>
        </div>
      </aside>

      {/* ── Formulario ─────────────────────────────────────── */}
      <main className="flex w-full flex-col items-center justify-center bg-gray-50 px-4 py-10 lg:w-1/2 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-forest-600 text-white">
              <Sprout className="h-7 w-7 text-white" />
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold text-slate-900">
            Bienvenido de nuevo
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Inicia sesión para acceder a tu cuenta de AgroData.
          </p>

          <div className="mt-8 space-y-4">
            {error && (
              <div
                className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            {info && (
              <div
                className="flex items-center gap-2.5 rounded-lg border border-forest-200 bg-forest-50 px-4 py-3 text-sm text-forest-700"
                role="status"
              >
                <ShieldCheck className="h-4 w-4 shrink-0" />
                {info}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${
                    fieldErrors.email ? "text-red-400" : "text-gray-400"
                  }`}
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder="tu@email.com"
                  className={`${inputBase} ${fieldErrors.email ? inputError : inputNormal}`}
                  aria-invalid={Boolean(fieldErrors.email)}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={handleForgot}
                  className="text-xs font-semibold text-forest-700 transition-colors hover:text-forest-800"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <Lock
                  className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${
                    fieldErrors.password ? "text-red-400" : "text-gray-400"
                  }`}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder="••••••••"
                  className={`${inputBase} pr-11 ${fieldErrors.password ? inputError : inputNormal}`}
                  aria-invalid={Boolean(fieldErrors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition-colors hover:text-forest-700"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-forest-600"
              />
              <span className="text-sm text-gray-600">Recuérdame</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-forest-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-700 active:bg-forest-800 disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">o</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="font-semibold text-forest-700 transition-colors hover:text-forest-800"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

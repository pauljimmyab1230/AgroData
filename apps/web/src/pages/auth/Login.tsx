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

  // Estilos de inputs ahora integrados directamente en los campos del formulario

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-forest-50/30">
      {/* ── Panel de marca ─────────────────────────────────── */}
      <aside className="hidden w-1/2 flex-col relative overflow-hidden lg:flex">
        {/* Fondo decorativo con gradiente y patrón */}
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        {/* Círculos decorativos */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-forest-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-forest-500/15 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-1 flex-col justify-between p-10 xl:p-14">
          <div className="flex items-center gap-3 animate-[slideInLeft_0.6s_ease-out]">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm text-white shadow-lg shadow-forest-900/30">
              <Sprout className="h-6 w-6" />
            </span>
            <span className="text-2xl font-bold tracking-tight text-white">AgroData</span>
          </div>

          <div className="max-w-lg animate-[slideInLeft_0.8s_ease-out]">
            <h2 className="font-display text-4xl font-semibold leading-tight text-white xl:text-5xl drop-shadow-lg">
              El campo, conectado a cada decisión
            </h2>
            <p className="mt-6 text-base leading-relaxed text-forest-100/90 xl:text-lg">
              Gestiona productores, parcelas, campañas, inspecciones y toda la trazabilidad de tu
              cooperativa agrícola en una sola plataforma.
            </p>

            <ul className="mt-12 space-y-6">
              {features.map(({ icon: Icon, title, description }, index) => (
                <li 
                  key={title} 
                  className="flex items-start gap-4 group"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <span className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm text-forest-300 group-hover:bg-white/20 group-hover:text-white transition-all duration-300 shadow-lg">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm text-forest-100/80">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 animate-[slideInLeft_1s_ease-out] hover:bg-white/10 transition-all duration-300">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-forest-200">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="text-sm text-forest-100/90">
              <span className="font-semibold text-white">Trazabilidad certificada</span>
              <br />
              Cumple estándares de calidad desde el cultivo hasta el lote final.
            </p>
          </div>
        </div>
      </aside>

      {/* ── Formulario ─────────────────────────────────────── */}
      <main className="flex w-full flex-col items-center justify-center px-4 py-10 lg:w-1/2 lg:px-12 relative">
        {/* Fondo decorativo sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-forest-50/20 to-transparent pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10 animate-[scaleIn_0.5s_ease-out]">
          {/* Logo móvil */}
          <div className="mb-10 text-center lg:hidden animate-[scaleIn_0.4s_ease-out]">
            <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-500 to-forest-700 text-white shadow-xl shadow-forest-600/30">
              <Sprout className="h-8 w-8 text-white" />
            </span>
          </div>

          {/* Título con efecto de texto */}
          <div className="animate-[slideInRight_0.6s_ease-out]">
            <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
              Bienvenido de nuevo
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Inicia sesión para acceder a tu cuenta de AgroData.
            </p>
          </div>

          {/* Mensajes de error/info */}
          <div className="mt-8 space-y-4 animate-[slideInRight_0.7s_ease-out]">
            {error && (
              <div
                className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/80 backdrop-blur-sm px-4 py-3.5 text-sm text-red-700 shadow-sm"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            {info && (
              <div
                className="flex items-center gap-3 rounded-xl border border-forest-200 bg-forest-50/80 backdrop-blur-sm px-4 py-3.5 text-sm text-forest-700 shadow-sm"
                role="status"
              >
                <ShieldCheck className="h-4 w-4 shrink-0" />
                {info}
              </div>
            )}
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6 animate-[slideInRight_0.8s_ease-out]" noValidate>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Correo electrónico
              </label>
              <div className="relative group">
                <Mail
                  className={`absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 transition-colors duration-200 ${
                    fieldErrors.email ? "text-red-400" : "text-gray-400 group-focus-within:text-forest-600"
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
                  className={`w-full rounded-xl border bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-offset-0 ${
                    fieldErrors.email 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 hover:border-gray-300 focus:border-forest-500 focus:ring-forest-500/20 focus:shadow-lg focus:shadow-forest-500/10"
                  }`}
                  aria-invalid={Boolean(fieldErrors.email)}
                />
              </div>
              {fieldErrors.email && (
                <p className="flex items-center gap-1.5 text-xs text-red-600 animate-[fadeIn_0.2s_ease-out]">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={handleForgot}
                  className="text-xs font-semibold text-forest-600 transition-colors hover:text-forest-700 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 transition-colors duration-200 ${
                    fieldErrors.password ? "text-red-400" : "text-gray-400 group-focus-within:text-forest-600"
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
                  className={`w-full rounded-xl border bg-white py-3 pl-12 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-offset-0 ${
                    fieldErrors.password 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 hover:border-gray-300 focus:border-forest-500 focus:ring-forest-500/20 focus:shadow-lg focus:shadow-forest-500/10"
                  }`}
                  aria-invalid={Boolean(fieldErrors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 transition-all duration-200 hover:text-forest-600 hover:bg-forest-50"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="flex items-center gap-1.5 text-xs text-red-600 animate-[fadeIn_0.2s_ease-out]">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-3 select-none group">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-gray-300 accent-forest-600 transition-colors"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Recuérdame</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="relative flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-forest-600 to-forest-700 px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:from-forest-700 hover:to-forest-800 hover:shadow-xl hover:shadow-forest-600/30 active:from-forest-800 active:to-forest-900 disabled:pointer-events-none disabled:opacity-60 group overflow-hidden"
            >
              {/* Efecto shimmer en hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin relative z-10" />
                  <span className="relative z-10">Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">Iniciar sesión</span>
                  <ArrowRight className="h-4.5 w-4.5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="mt-10 flex items-center gap-4 animate-[fadeIn_1s_ease-out]">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-gray-300" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400 bg-white px-2">o</span>
            <span className="h-px flex-1 bg-gradient-to-r from-gray-300 via-gray-200 to-transparent" />
          </div>

          {/* Registro */}
          <p className="mt-8 text-center text-sm text-gray-500 animate-[fadeIn_1.1s_ease-out]">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="font-semibold text-forest-600 transition-all duration-200 hover:text-forest-700 hover:underline underline-offset-4"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

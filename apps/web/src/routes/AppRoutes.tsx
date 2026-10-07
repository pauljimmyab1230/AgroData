import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { LoadingSpinner } from "../components/ui";

const Login = lazy(() => import("../pages/auth/Login"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const ProductorList = lazy(() => import("../pages/productores/ProductorList"));
const ProductorView = lazy(() => import("../pages/productores/ProductorView"));
const ProductorCreate = lazy(() => import("../pages/productores/ProductorCreate"));
const ProductorEdit = lazy(() => import("../pages/productores/ProductorEdit"));
const ParcelaList = lazy(() => import("../pages/parcelas/ParcelaList"));
const ParcelaView = lazy(() => import("../pages/parcelas/ParcelaView"));
const ParcelaEdit = lazy(() => import("../pages/parcelas/ParcelaEdit"));
const CultivoList = lazy(() => import("../pages/cultivos/CultivoList"));
const CultivoView = lazy(() => import("../pages/cultivos/CultivoView"));
const CampaniaList = lazy(() => import("../pages/campañas/CampaniaList"));
const CampaniaCreate = lazy(() => import("../pages/campañas/CampaniaCreate"));
const CampaniaView = lazy(() => import("../pages/campañas/CampaniaView"));
const CampaniaEdit = lazy(() => import("../pages/campañas/CampaniaEdit"));
const ActividadList = lazy(() => import("../pages/actividades/ActividadList"));
const ActividadCreate = lazy(() => import("../pages/actividades/ActividadCreate"));
const ActividadView = lazy(() => import("../pages/actividades/ActividadView"));
const ActividadEdit = lazy(() => import("../pages/actividades/ActividadEdit"));
const InspeccionList = lazy(() => import("../pages/inspecciones/InspeccionList"));
const InspeccionCreate = lazy(() => import("../pages/inspecciones/InspeccionCreate"));
const InspeccionView = lazy(() => import("../pages/inspecciones/InspeccionView"));
const InspeccionEdit = lazy(() => import("../pages/inspecciones/InspeccionEdit"));
const AcopioList = lazy(() => import("../pages/acopio/AcopioList"));
const AcopioView = lazy(() => import("../pages/acopio/AcopioView"));
const RecepcionList = lazy(() => import("../pages/recepcion/RecepcionList"));
const RecepcionView = lazy(() => import("../pages/recepcion/RecepcionView"));
const OrdenList = lazy(() => import("../pages/procesamiento/OrdenList"));
const OrdenCreate = lazy(() => import("../pages/procesamiento/OrdenCreate"));
const OrdenView = lazy(() => import("../pages/procesamiento/OrdenView"));
const OrdenEdit = lazy(() => import("../pages/procesamiento/OrdenEdit"));
const KardexList = lazy(() => import("../pages/kardex/KardexList"));
const KardexView = lazy(() => import("../pages/kardex/KardexView"));
const KardexCreate = lazy(() => import("../pages/kardex/KardexCreate"));
const KardexEdit = lazy(() => import("../pages/kardex/KardexEdit"));
const UsuarioList = lazy(() => import("../pages/usuarios/UsuarioList"));
const UsuarioCreate = lazy(() => import("../pages/usuarios/UsuarioCreate"));
const UsuarioView = lazy(() => import("../pages/usuarios/UsuarioView"));
const UsuarioEdit = lazy(() => import("../pages/usuarios/UsuarioEdit"));
const CatalogPage = lazy(() => import("../pages/catalogos/CatalogPage"));

function SuspenseLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <LoadingSpinner text="Cargando..." />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="mt-4 text-lg font-medium text-gray-600">Página no encontrada</p>
      <p className="mt-2 text-sm text-gray-500">La ruta que ingresaste no existe.</p>
    </div>
  );
}

export default function AppRoutes() {
    return (
        <Suspense fallback={<SuspenseLoader />}>
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/parcelas" element={<ParcelaList />} />
                    <Route path="/parcelas/:id" element={<ParcelaView />} />
                    <Route path="/parcelas/:id/editar" element={<ParcelaEdit />} />
                    <Route path="/cultivos" element={<CultivoList />} />
                    <Route path="/cultivos/:id" element={<CultivoView />} />
                    <Route path="/campanias" element={<CampaniaList />} />
                    <Route path="/campanias/nueva" element={<CampaniaCreate />} />
                    <Route path="/campanias/:id" element={<CampaniaView />} />
                    <Route path="/campanias/:id/editar" element={<CampaniaEdit />} />
                    <Route path="/actividades" element={<ActividadList />} />
                    <Route path="/actividades/nueva" element={<ActividadCreate />} />
                    <Route path="/actividades/:id" element={<ActividadView />} />
                    <Route path="/actividades/:id/editar" element={<ActividadEdit />} />
                    <Route path="/inspecciones" element={<InspeccionList />} />
                    <Route path="/inspecciones/nueva" element={<InspeccionCreate />} />
                    <Route path="/inspecciones/:id" element={<InspeccionView />} />
                    <Route path="/inspecciones/:id/editar" element={<InspeccionEdit />} />
                    <Route path="/acopio" element={<AcopioList />} />
                    <Route path="/acopio/:id" element={<AcopioView />} />
                    <Route path="/recepcion" element={<RecepcionList />} />
                    <Route path="/recepcion/:id" element={<RecepcionView />} />
                    <Route path="/procesamiento" element={<OrdenList />} />
                    <Route path="/procesamiento/nueva" element={<OrdenCreate />} />`n                    <Route path="/procesamiento/:id" element={<OrdenView />} />`n                    <Route path="/procesamiento/:id/editar" element={<OrdenEdit />} />
                    <Route path="/kardex" element={<KardexList />} />
                    <Route path="/kardex/nuevo" element={<KardexCreate />} />
                    <Route path="/kardex/:id" element={<KardexView />} />
                    <Route path="/kardex/:id/editar" element={<KardexEdit />} />
                    <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
                        <Route path="/usuarios" element={<UsuarioList />} />
                        <Route path="/usuarios/nuevo" element={<UsuarioCreate />} />
                        <Route path="/usuarios/:id" element={<UsuarioView />} />
                        <Route path="/usuarios/:id/editar" element={<UsuarioEdit />} />
                        <Route path="/catalogos/:catalogoId" element={<CatalogPage />} />
                    </Route>
                    <Route path="/productores" element={<ProductorList />} />
                    <Route path="/productores/nueva" element={<ProductorCreate />} />
                    <Route path="/productores/:id" element={<ProductorView />} />
                    <Route path="/productores/:id/editar" element={<ProductorEdit />} />
                </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
    );
}

import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import ProductorList from "../pages/productores/ProductorList";
import ParcelaList from "../pages/parcelas/ParcelaList";
import ParcelaView from "../pages/parcelas/ParcelaView";
import ParcelaEdit from "../pages/parcelas/ParcelaEdit";
import CultivoList from "../pages/cultivos/CultivoList";
import CultivoCreate from "../pages/cultivos/CultivoCreate";
import CultivoView from "../pages/cultivos/CultivoView";
import CultivoEdit from "../pages/cultivos/CultivoEdit";
import CampaniaList from "../pages/campañas/CampaniaList";
import CampaniaCreate from "../pages/campañas/CampaniaCreate";
import CampaniaView from "../pages/campañas/CampaniaView";
import CampaniaEdit from "../pages/campañas/CampaniaEdit";
import ActividadList from "../pages/actividades/ActividadList";
import ActividadCreate from "../pages/actividades/ActividadCreate";
import ActividadView from "../pages/actividades/ActividadView";
import ActividadEdit from "../pages/actividades/ActividadEdit";
import InspeccionList from "../pages/inspecciones/InspeccionList";
import InspeccionCreate from "../pages/inspecciones/InspeccionCreate";
import InspeccionView from "../pages/inspecciones/InspeccionView";
import InspeccionEdit from "../pages/inspecciones/InspeccionEdit";
import AcopioList from "../pages/acopio/AcopioList";
import AcopioCreate from "../pages/acopio/AcopioCreate";
import AcopioView from "../pages/acopio/AcopioView";
import AcopioEdit from "../pages/acopio/AcopioEdit";
import RecepcionList from "../pages/recepcion/RecepcionList";
import RecepcionCreate from "../pages/recepcion/RecepcionCreate";
import RecepcionView from "../pages/recepcion/RecepcionView";
import RecepcionEdit from "../pages/recepcion/RecepcionEdit";
import ProcesamientoList from "../pages/procesamiento/ProcesamientoList";
import ProcesamientoCreate from "../pages/procesamiento/ProcesamientoCreate";
import ProcesamientoView from "../pages/procesamiento/ProcesamientoView";
import ProcesamientoEdit from "../pages/procesamiento/ProcesamientoEdit";
import KardexList from "../pages/kardex/KardexList";
import KardexView from "../pages/kardex/KardexView";
import KardexCreate from "../pages/kardex/KardexCreate";
import KardexEdit from "../pages/kardex/KardexEdit";
import UsuarioList from "../pages/usuarios/UsuarioList";
import UsuarioCreate from "../pages/usuarios/UsuarioCreate";
import UsuarioView from "../pages/usuarios/UsuarioView";
import UsuarioEdit from "../pages/usuarios/UsuarioEdit";
import CatalogPage from "../pages/catalogos/CatalogPage";
import ProductorView from "../pages/productores/ProductorView";
import ProductorCreate from "../pages/productores/ProductorCreate";
import ProductorEdit from "../pages/productores/ProductorEdit";

export default function AppRoutes() {
    return (
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
                    <Route path="/procesamiento" element={<ProcesamientoList />} />
                    <Route path="/procesamiento/:id" element={<ProcesamientoView />} />
                    <Route path="/kardex" element={<KardexList />} />
                    <Route path="/kardex/nuevo" element={<KardexCreate />} />
                    <Route path="/kardex/:id" element={<KardexView />} />
                    <Route path="/kardex/:id/editar" element={<KardexEdit />} />
                    <Route path="/usuarios" element={<UsuarioList />} />
                    <Route path="/usuarios/nuevo" element={<UsuarioCreate />} />
                    <Route path="/usuarios/:id" element={<UsuarioView />} />
                    <Route path="/usuarios/:id/editar" element={<UsuarioEdit />} />
                    <Route path="/catalogos/:catalogoId" element={<CatalogPage />} />
                    <Route path="/productores" element={<ProductorList />} />
                    <Route path="/productores/nueva" element={<ProductorCreate />} />
                    <Route path="/productores/:id" element={<ProductorView />} />
                    <Route path="/productores/:id/editar" element={<ProductorEdit />} />
                </Route>
            </Route>
        </Routes>
    );
}

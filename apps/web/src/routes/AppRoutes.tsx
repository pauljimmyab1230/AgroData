import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import ProductorList from "../pages/productores/ProductorList";
import ParcelaList from "../pages/parcelas/ParcelaList";
import ParcelaCreate from "../pages/parcelas/ParcelaCreate";
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
import InventarioList from "../pages/inventario/InventarioList";
import InventarioView from "../pages/inventario/InventarioView";
import InventarioCreate from "../pages/inventario/InventarioCreate";
import InventarioEdit from "../pages/inventario/InventarioEdit";
import LoteList from "../pages/lotes/LoteList";
import LoteView from "../pages/lotes/LoteView";
import LoteCreate from "../pages/lotes/LoteCreate";
import LoteEdit from "../pages/lotes/LoteEdit";
import TrazabilidadList from "../pages/trazabilidad/TrazabilidadList";
import TrazabilidadView from "../pages/trazabilidad/TrazabilidadView";
import TrazabilidadCreate from "../pages/trazabilidad/TrazabilidadCreate";
import TrazabilidadEdit from "../pages/trazabilidad/TrazabilidadEdit";
import CatalogPage from "../pages/catalogos/CatalogPage";
import ProductorCreate from "../pages/productores/ProductorCreate";
import ProductorView from "../pages/productores/ProductorView";
import ProductorEdit from "../pages/productores/ProductorEdit";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/productores" element={<ProductorList />} />
                    <Route path="/parcelas" element={<ParcelaList />} />
                    <Route path="/parcelas/nueva" element={<ParcelaCreate />} />
                    <Route path="/parcelas/:id" element={<ParcelaView />} />
                    <Route path="/parcelas/:id/editar" element={<ParcelaEdit />} />
                    <Route path="/cultivos" element={<CultivoList />} />
                    <Route path="/cultivos/nuevo" element={<CultivoCreate />} />
                    <Route path="/cultivos/:id" element={<CultivoView />} />
                    <Route path="/cultivos/:id/editar" element={<CultivoEdit />} />
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
                    <Route path="/acopio/nuevo" element={<AcopioCreate />} />
                    <Route path="/acopio/:id" element={<AcopioView />} />
                    <Route path="/acopio/:id/editar" element={<AcopioEdit />} />
                    <Route path="/recepcion" element={<RecepcionList />} />
                    <Route path="/recepcion/nuevo" element={<RecepcionCreate />} />
                    <Route path="/recepcion/:id" element={<RecepcionView />} />
                    <Route path="/recepcion/:id/editar" element={<RecepcionEdit />} />
                    <Route path="/procesamiento" element={<ProcesamientoList />} />
                    <Route path="/procesamiento/nuevo" element={<ProcesamientoCreate />} />
                    <Route path="/procesamiento/:id" element={<ProcesamientoView />} />
                    <Route path="/procesamiento/:id/editar" element={<ProcesamientoEdit />} />
                    <Route path="/lotes" element={<LoteList />} />
                    <Route path="/lotes/nuevo" element={<LoteCreate />} />
                    <Route path="/lotes/:id" element={<LoteView />} />
                    <Route path="/lotes/:id/editar" element={<LoteEdit />} />
                    <Route path="/inventario" element={<InventarioList />} />
                    <Route path="/inventario/nuevo" element={<InventarioCreate />} />
                    <Route path="/inventario/:id" element={<InventarioView />} />
                    <Route path="/inventario/:id/editar" element={<InventarioEdit />} />
                    <Route path="/trazabilidad" element={<TrazabilidadList />} />
                    <Route path="/trazabilidad/nueva" element={<TrazabilidadCreate />} />
                    <Route path="/trazabilidad/:id" element={<TrazabilidadView />} />
                    <Route path="/trazabilidad/:id/editar" element={<TrazabilidadEdit />} />
                    <Route path="/catalogos/:catalogoId" element={<CatalogPage />} />
                    <Route path="/productores/nuevo" element={<ProductorCreate />} />
                    <Route path="/productores/:id" element={<ProductorView />} />
                    <Route path="/productores/:id/editar" element={<ProductorEdit />} />
                </Route>
            </Route>
        </Routes>
    );
}

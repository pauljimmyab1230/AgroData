import { useNavigate } from "react-router-dom";
import { DatosGeneralesCard } from "./DatosGeneralesCard";
import { InformacionCultivoCard } from "./InformacionCultivoCard";
import { InformacionTecnicaCard } from "./InformacionTecnicaCard";
import { EstimacionProduccionCard } from "./EstimacionProduccionCard";
import { EstadoFenologicoCard } from "./EstadoFenologicoCard";
import { CronogramaCard } from "./CronogramaCard";
import { FotografiasCard } from "./FotografiasCard";
import { ObservacionesCard } from "./ObservacionesCard";
import ActionButtons from "./ActionButtons";
import { createCultivo, updateCultivo, type Cultivo } from "../../services/cultivos";
import type { FormMode } from "../shared/formControls";

interface CultivoFormProps {
  mode: Extract<FormMode, "create" | "edit">;
  values?: Partial<Cultivo>;
}

export default function CultivoForm({ mode, values }: CultivoFormProps) {
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      if (mode === "create") {
        const result = await createCultivo({
          campaniaId: values?.campaniaId || "",
          productorId: values?.productorId || "",
          parcelaId: values?.parcelaId || "",
          cultivo: values?.cultivo || "",
          variedad: values?.variedad,
          areaSembrada: values?.areaSembrada,
          fechaSiembra: values?.fechaSiembra,
          metodoSiembra: values?.metodoSiembra,
          sistemaProductivo: values?.sistemaProductivo,
          tipoAgricultura: values?.tipoAgricultura,
          certificacion: values?.certificacion,
          procedenciaSemilla: values?.procedenciaSemilla,
          cantidadSemilla: values?.cantidadSemilla,
          unidadSemilla: values?.unidadSemilla,
          fechaEmergencia: values?.fechaEmergencia,
          fechaFloracion: values?.fechaFloracion,
          fechaCosecha: values?.fechaCosecha,
          estado: values?.estado,
          observaciones: values?.observaciones,
          estadoFenologico: values?.estadoFenologico,
          rendimientoEsperado: values?.rendimientoEsperado,
          produccionEstimada: values?.produccionEstimada,
          destinoProduccion: values?.destinoProduccion,
          distanciamientoSurcos: values?.distanciamientoSurcos,
          distanciamientoPlantas: values?.distanciamientoPlantas,
          densidadSiembra: values?.densidadSiembra,
          tipoSemilla: values?.tipoSemilla,
          loteSemilla: values?.loteSemilla,
          proveedorSemilla: values?.proveedorSemilla,
        });
        navigate(`/cultivos/${result.id}`);
      } else if (values?.id) {
        await updateCultivo(values.id, values);
        navigate(`/cultivos/${values.id}`);
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al guardar.";
      alert(msg);
    }
  };

  const cancelTo = mode === "create" ? "/cultivos" : `/cultivos/${values?.id ?? ""}`;

  return (
    <div className="space-y-6">
      <DatosGeneralesCard mode={mode} values={values} />
      <InformacionCultivoCard mode={mode} values={values} />
      <InformacionTecnicaCard mode={mode} values={values} />
      <EstimacionProduccionCard mode={mode} values={values} />
      <EstadoFenologicoCard mode={mode} values={values} />
      <CronogramaCard mode={mode} values={values} />
      <FotografiasCard mode={mode} />
      <ObservacionesCard mode={mode} value={values?.observaciones} />
      <ActionButtons cancelTo={cancelTo} onSave={handleSave} />
    </div>
  );
}

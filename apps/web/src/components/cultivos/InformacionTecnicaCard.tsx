import { FlaskConical } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  sistemasProductivosValues,
  tiposAgriculturaValues,
  certificacionesValues,
  procedenciasSemillaValues,
  unidadesSemillaValues,
  tiposSemillaValues,
  type Cultivo,
} from "../../services/cultivos";

type InformacionTecnicaCardProps = {
  mode: FormMode;
  values?: Partial<Cultivo>;
  onChange?: (patch: Partial<Cultivo>) => void;
};

export function InformacionTecnicaCard({ mode, values, onChange }: InformacionTecnicaCardProps) {
  return (
    <CardShell>
      <CardHeader
        icon={<FlaskConical size={20} />}
        title="Información Técnica"
        description="Sistema productivo, certificación y manejo de semilla"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Sistema Productivo" mode={mode} value={values?.sistemaProductivo}>
          <Select
            options={sistemasProductivosValues.map((v) => ({ value: v, label: v }))}
            placeholder="Seleccione el sistema"
            value={values?.sistemaProductivo}
            onChange={(val) => onChange?.({ sistemaProductivo: val })}
          />
        </Field>

        <Field label="Tipo de Agricultura" mode={mode} value={values?.tipoAgricultura}>
          <Select
            options={tiposAgriculturaValues.map((v) => ({ value: v, label: v }))}
            placeholder="Seleccione el tipo"
            value={values?.tipoAgricultura}
            onChange={(val) => onChange?.({ tipoAgricultura: val })}
          />
        </Field>

        <Field label="Certificación" mode={mode} value={values?.certificacion}>
          <Select
            options={certificacionesValues.map((v) => ({ value: v, label: v }))}
            placeholder="Seleccione la certificación"
            value={values?.certificacion}
            onChange={(val) => onChange?.({ certificacion: val })}
          />
        </Field>

        <Field label="Procedencia de la Semilla" mode={mode} value={values?.procedenciaSemilla}>
          <Select
            options={procedenciasSemillaValues.map((v) => ({ value: v, label: v }))}
            placeholder="Seleccione la procedencia"
            value={values?.procedenciaSemilla}
            onChange={(val) => onChange?.({ procedenciaSemilla: val })}
          />
        </Field>

        <Field label="Cantidad de Semilla" mode={mode} value={values?.cantidadSemilla?.toString()}>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="Ej. 9.60"
            value={values?.cantidadSemilla ?? undefined}
            onChange={(e) => onChange?.({ cantidadSemilla: Number(e.target.value) || 0 })}
          />
        </Field>

        <Field label="Unidad" mode={mode} value={values?.unidadSemilla}>
          <Select
            options={unidadesSemillaValues.map((v) => ({ value: v, label: v }))}
            placeholder="Seleccione la unidad"
            value={values?.unidadSemilla}
            onChange={(val) => onChange?.({ unidadSemilla: val })}
          />
        </Field>

        <Field label="Distanciamiento entre Surcos" mode={mode} value={values?.distanciamientoSurcos}>
          <Input
            type="text"
            placeholder="Ej. 0.80 m"
            value={values?.distanciamientoSurcos}
            onChange={(e) => onChange?.({ distanciamientoSurcos: e.target.value })}
          />
        </Field>

        <Field label="Distanciamiento entre Plantas" mode={mode} value={values?.distanciamientoPlantas}>
          <Input
            type="text"
            placeholder="Ej. 0.15 m"
            value={values?.distanciamientoPlantas}
            onChange={(e) => onChange?.({ distanciamientoPlantas: e.target.value })}
          />
        </Field>

        <Field label="Densidad de Siembra" mode={mode} value={values?.densidadSiembra}>
          <Input
            type="text"
            placeholder="Ej. 12 kg/ha"
            value={values?.densidadSiembra}
            onChange={(e) => onChange?.({ densidadSiembra: e.target.value })}
          />
        </Field>

        <Field label="Tipo de Semilla" mode={mode} value={values?.tipoSemilla}>
          <Select
            options={tiposSemillaValues.map((v) => ({ value: v, label: v }))}
            placeholder="Seleccione el tipo"
            value={values?.tipoSemilla}
            onChange={(val) => onChange?.({ tipoSemilla: val })}
          />
        </Field>

        <Field label="Lote de Semilla" mode={mode} value={values?.loteSemilla}>
          <Input
            type="text"
            placeholder="Ej. LOTE-Q-2025-01"
            value={values?.loteSemilla}
            onChange={(e) => onChange?.({ loteSemilla: e.target.value })}
          />
        </Field>

        <Field label="Proveedor de Semilla" mode={mode} value={values?.proveedorSemilla}>
          <Input
            type="text"
            placeholder="Ej. Semillas del Perú S.A.C."
            value={values?.proveedorSemilla}
            onChange={(e) => onChange?.({ proveedorSemilla: e.target.value })}
          />
        </Field>
      </div>
    </CardShell>
  );
}

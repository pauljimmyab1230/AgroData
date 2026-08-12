import { FlaskConical } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  certificacionesOpciones,
  procedenciasSemillaOpciones,
  sistemasProductivosOpciones,
  tiposAgriculturaOpciones,
  tiposSemillaOpciones,
  unidadesSemillaOpciones,
  type Cultivo,
} from "../../services/cultivos";

type InformacionTecnicaCardProps = {
  mode: FormMode;
  values?: Partial<Cultivo>;
};

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function InformacionTecnicaCard({ mode, values }: InformacionTecnicaCardProps) {
  const editable = mode !== "view";

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
            options={toOptions(sistemasProductivosOpciones)}
            placeholder="Seleccione el sistema"
            defaultValue={editable ? values?.sistemaProductivo : undefined}
          />
        </Field>

        <Field label="Tipo de Agricultura" mode={mode} value={values?.tipoAgricultura}>
          <Select
            options={toOptions(tiposAgriculturaOpciones)}
            placeholder="Seleccione el tipo"
            defaultValue={editable ? values?.tipoAgricultura : undefined}
          />
        </Field>

        <Field label="Certificación" mode={mode} value={values?.certificacion}>
          <Select
            options={toOptions(certificacionesOpciones)}
            placeholder="Seleccione la certificación"
            defaultValue={editable ? values?.certificacion : undefined}
          />
        </Field>

        <Field label="Procedencia de la Semilla" mode={mode} value={values?.procedenciaSemilla}>
          <Select
            options={toOptions(procedenciasSemillaOpciones)}
            placeholder="Seleccione la procedencia"
            defaultValue={editable ? values?.procedenciaSemilla : undefined}
          />
        </Field>

        <Field label="Cantidad de Semilla" mode={mode} value={values?.cantidadSemilla?.toString()}>
          <Input type="number" min="0" step="0.01" placeholder="Ej. 9.60" defaultValue={values?.cantidadSemilla ?? undefined} />
        </Field>

        <Field label="Unidad" mode={mode} value={values?.unidadSemilla}>
          <Select
            options={toOptions(unidadesSemillaOpciones)}
            placeholder="Seleccione la unidad"
            defaultValue={editable ? values?.unidadSemilla : undefined}
          />
        </Field>

        <Field label="Distanciamiento entre Surcos" mode={mode} value={values?.distanciamientoSurcos}>
          <Input type="text" placeholder="Ej. 0.80 m" defaultValue={values?.distanciamientoSurcos} />
        </Field>

        <Field label="Distanciamiento entre Plantas" mode={mode} value={values?.distanciamientoPlantas}>
          <Input type="text" placeholder="Ej. 0.15 m" defaultValue={values?.distanciamientoPlantas} />
        </Field>

        <Field label="Densidad de Siembra" mode={mode} value={values?.densidadSiembra}>
          <Input type="text" placeholder="Ej. 12 kg/ha" defaultValue={values?.densidadSiembra} />
        </Field>

        <Field label="Tipo de Semilla" mode={mode} value={values?.tipoSemilla}>
          <Select
            options={toOptions(tiposSemillaOpciones)}
            placeholder="Seleccione el tipo"
            defaultValue={editable ? values?.tipoSemilla : undefined}
          />
        </Field>

        <Field label="Lote de Semilla" mode={mode} value={values?.loteSemilla}>
          <Input type="text" placeholder="Ej. LOTE-Q-2025-01" defaultValue={values?.loteSemilla} />
        </Field>

        <Field label="Proveedor de Semilla" mode={mode} value={values?.proveedorSemilla}>
          <Input type="text" placeholder="Ej. Semillas del Perú S.A.C." defaultValue={values?.proveedorSemilla} />
        </Field>
      </div>
    </CardShell>
  );
}

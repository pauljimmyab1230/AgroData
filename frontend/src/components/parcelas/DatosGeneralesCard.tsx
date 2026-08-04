import { Tractor } from "lucide-react";
import { Input, Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import {
  comunidadesOpciones,
  cultivosOpciones,
  estadosOpciones,
  productoresOpciones,
  sectoresOpciones,
  type Parcela,
} from "../../pages/parcelas/parcelaMock";

type DatosGeneralesCardProps = {
  mode: FormMode;
  values?: Partial<Parcela>;
};

export function DatosGeneralesCard({ mode, values }: DatosGeneralesCardProps) {
  const editable = mode !== "view";

  const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

  return (
    <CardShell>
      <CardHeader
        icon={<Tractor size={20} />}
        title="Datos de la Parcela"
        description="Información general y características productivas de la parcela"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Código" mode={mode} value={values?.codigo}>
          <Input placeholder="Se genera automáticamente" disabled defaultValue={values?.codigo} />
        </Field>

        <Field label="Nombre de Parcela" mode={mode} value={values?.nombre}>
          <Input type="text" placeholder="Ej. Parcela A - Ñawpa Rumi" defaultValue={values?.nombre} />
        </Field>

        <Field label="Productor" mode={mode} value={values?.productor}>
          <Select
            options={toOptions(productoresOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.productor : undefined}
          />
        </Field>

        <Field label="Comunidad" mode={mode} value={values?.comunidad}>
          <Select
            options={toOptions(comunidadesOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.comunidad : undefined}
          />
        </Field>

        <Field label="Sector" mode={mode} value={values?.sector}>
          <Select
            options={toOptions(sectoresOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.sector : undefined}
          />
        </Field>

        <Field label="Altitud" mode={mode} value={values?.altitud}>
          <Input type="text" placeholder="Ej. 3,450 m.s.n.m." defaultValue={values?.altitud} />
        </Field>

        <Field label="Área Total (ha)" mode={mode} value={values?.areaTotal}>
          <Input type="text" placeholder="Ej. 2.40" defaultValue={values?.areaTotal} />
        </Field>

        <Field label="Área Certificada (ha)" mode={mode} value={values?.areaCertificada}>
          <Input type="text" placeholder="Ej. 2.40" defaultValue={values?.areaCertificada} />
        </Field>

        <Field label="Cultivo Principal" mode={mode} value={values?.cultivoPrincipal}>
          <Select
            options={toOptions(cultivosOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.cultivoPrincipal : undefined}
          />
        </Field>

        <Field label="Estado" mode={mode} value={values?.estado}>
          <Select
            options={toOptions(estadosOpciones)}
            placeholder="Seleccione"
            defaultValue={editable ? values?.estado : undefined}
          />
        </Field>
      </div>
    </CardShell>
  );
}

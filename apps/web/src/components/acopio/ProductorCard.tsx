import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { Select } from "../ui";
import { CardHeader, CardShell, Field, type FormMode } from "../shared/formControls";
import type { AcopioView } from "../../services/acopios";
import api from "../../services/api";

type ProductorCardProps = {
  mode: FormMode;
  values?: Partial<AcopioView>;
};

interface SelectOption {
  value: string;
  label: string;
}

export function ProductorCard({ mode, values }: ProductorCardProps) {
  const editable = mode !== "view";
  const [productores, setProductores] = useState<SelectOption[]>([]);
  const [parcelas, setParcelas] = useState<SelectOption[]>([]);
  const [cultivos, setCultivos] = useState<SelectOption[]>([]);
  const [selectedProductorId, setSelectedProductorId] = useState<string>(values?.productorId ?? "");

  useEffect(() => {
    if (!editable) return;
    api.get("/productores", { params: { limit: 200 } })
      .then((res) => {
        setProductores(
          (res.data.data ?? []).map((p: { id: string | number; nombres: string; apellido_paterno: string; apellido_materno: string }) => ({
            value: String(p.id),
            label: `${p.nombres} ${p.apellido_paterno} ${p.apellido_materno}`.trim(),
          }))
        );
      })
      .catch(() => {});
  }, [editable]);

  useEffect(() => {
    if (!editable || !selectedProductorId) {
      setParcelas([]);
      setCultivos([]);
      return;
    }
    api.get("/parcelas", { params: { productor_id: selectedProductorId, limit: 200 } })
      .then((res) => {
        setParcelas(
          (res.data.data ?? []).map((p: { id: string | number; nombre: string; codigo: string }) => ({
            value: String(p.id),
            label: `${p.codigo} - ${p.nombre}`,
          }))
        );
      })
      .catch(() => setParcelas([]));
  }, [editable, selectedProductorId]);

  return (
    <CardShell>
      <CardHeader
        icon={<UserRound size={20} />}
        title="Información del Productor"
        description="Datos del productor y de su lote de producción"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Productor" mode={mode} value={values?.productor}>
          <Select
            options={productores}
            placeholder="Seleccione el productor"
            value={selectedProductorId}
            onChange={(val) => {
              setSelectedProductorId(val);
              setParcelas([]);
              setCultivos([]);
            }}
          />
        </Field>

        <Field label="Parcela" mode={mode} value={values?.parcela}>
          <Select
            options={parcelas}
            placeholder={selectedProductorId ? "Seleccione la parcela" : "Primero seleccione un productor"}
            value={values?.parcelaId}
            disabled={!selectedProductorId}
          />
        </Field>

        <Field label="Cultivo" mode={mode} value={values?.cultivo}>
          <Select
            options={cultivos}
            placeholder={values?.parcelaId ? "Seleccione el cultivo" : "Primero seleccione una parcela"}
            value={values?.cultivoId}
            disabled={!values?.parcelaId}
          />
        </Field>

        <Field label="Lote del Productor (LP)" mode={mode} value={values?.loteProductor}>
          <Select
            options={[]}
            placeholder="Ingrese el lote"
            value={values?.loteProductor}
          />
        </Field>
      </div>
    </CardShell>
  );
}

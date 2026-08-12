import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, Save } from "lucide-react";
import { Button } from "../ui";
import ParcelaTabs from "./ParcelaTabs";
import { DatosGeneralesCard } from "./DatosGeneralesCard";
import { InformacionAgroecologicaCard } from "./InformacionAgroecologicaCard";
import { UbicacionCard } from "./UbicacionCard";
import { PoligonoCard } from "./PoligonoCard";
import { FotografiaCard } from "./FotografiaCard";
import { DocumentoCard } from "./DocumentoCard";
import { useParcelaForm } from "../../contexts/ParcelaFormContext";
import { createParcela, updateParcela, deleteFoto, deleteDocumento } from "../../services/parcelas";
import type { FormMode } from "../shared/formControls";

const totalTabs = 5;

interface ParcelaFormProps {
  mode: Extract<FormMode, "create" | "edit">;
}

export default function ParcelaForm({ mode }: ParcelaFormProps) {
  const { id } = useParams();
  const { data, validate, fotos, setFotos, documentos, setDocumentos } = useParcelaForm();
  const [tab, setTab] = useState(1);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!validate()) {
      setTab(1);
      return;
    }
    setSaving(true);
    try {
      if (mode === "create") {
        const parcela = await createParcela(data);
        navigate(`/parcelas/${parcela.id}`);
      } else {
        if (!id) throw new Error("ID de parcela no encontrado");
        const parcela = await updateParcela(id, data);
        navigate(`/parcelas/${parcela.id}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error al guardar. Verifique los datos.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFoto = async (fotoId: string) => {
    if (!id) return;
    try {
      await deleteFoto(id, fotoId);
      setFotos(fotos.filter((f) => f.id !== fotoId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDocumento = async (documentoId: string) => {
    if (!id) return;
    try {
      await deleteDocumento(id, documentoId);
      setDocumentos(documentos.filter((d) => d.id !== documentoId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <ParcelaTabs active={tab} onChange={setTab} />

      <div className="space-y-6">
        {tab === 1 && (
          <>
            <DatosGeneralesCard mode={mode} />
            <InformacionAgroecologicaCard mode={mode} />
          </>
        )}
        {tab === 2 && <UbicacionCard mode={mode} />}
        {tab === 3 && <PoligonoCard mode={mode} />}
        {tab === 4 && (
          <FotografiaCard
            mode={mode}
            fotos={fotos}
            onDelete={mode === "edit" ? handleDeleteFoto : undefined}
          />
        )}
        {tab === 5 && (
          <DocumentoCard
            mode={mode}
            documentos={documentos}
            onDelete={mode === "edit" ? handleDeleteDocumento : undefined}
          />
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <Button
          variant="secondary"
          onClick={() => setTab((current) => Math.max(1, current - 1))}
          disabled={tab === 1}
          iconLeft={<ChevronLeft className="h-4 w-4" />}
        >
          Anterior
        </Button>

        <p className="text-sm text-gray-500">
          Pestaña <span className="font-semibold text-forest-700">{tab}</span> de{" "}
          <span className="font-semibold text-[#111827]">{totalTabs}</span>
        </p>

        {tab === totalTabs ? (
          <Button onClick={handleSave} disabled={saving} iconLeft={<Save className="h-4 w-4" />}>
            {saving ? "Guardando..." : "Guardar Parcela"}
          </Button>
        ) : (
          <Button
            onClick={() => setTab((current) => Math.min(totalTabs, current + 1))}
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  );
}

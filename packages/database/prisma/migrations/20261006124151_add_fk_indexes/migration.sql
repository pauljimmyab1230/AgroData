-- CreateIndex
CREATE INDEX `Insumo_has_actividades_insumo_id_idx` ON `Insumo_has_actividades`(`insumo_id`);

-- CreateIndex
CREATE INDEX `Mano_de_obra_has_actividades_mano_de_obra_id_idx` ON `Mano_de_obra_has_actividades`(`mano_de_obra_id`);

-- CreateIndex
CREATE INDEX `Maquinaria_has_actividades_maquinaria_id_idx` ON `Maquinaria_has_actividades`(`maquinaria_id`);

-- RenameIndex
ALTER TABLE `acciones_correctivas` RENAME INDEX `Acciones_correctivas_no_conformidad_id_fkey` TO `Acciones_correctivas_no_conformidad_id_idx`;

-- RenameIndex
ALTER TABLE `actividades` RENAME INDEX `actividades_cultivo_id_fkey` TO `actividades_cultivo_id_idx`;

-- RenameIndex
ALTER TABLE `cultivo` RENAME INDEX `cultivo_campania_id_fkey` TO `cultivo_campania_id_idx`;

-- RenameIndex
ALTER TABLE `cultivo` RENAME INDEX `cultivo_parcela_id_fkey` TO `cultivo_parcela_id_idx`;

-- RenameIndex
ALTER TABLE `evidencia` RENAME INDEX `Evidencia_inspeccion_id_fkey` TO `Evidencia_inspeccion_id_idx`;

-- RenameIndex
ALTER TABLE `inspeccion_checklist` RENAME INDEX `inspeccion_checklist_inspeccion_id_fkey` TO `inspeccion_checklist_inspeccion_id_idx`;

-- RenameIndex
ALTER TABLE `inspecciones` RENAME INDEX `Inspecciones_cultivo_id_fkey` TO `Inspecciones_cultivo_id_idx`;

-- RenameIndex
ALTER TABLE `insumo_has_actividades` RENAME INDEX `Insumo_has_actividades_actividades_id_fkey` TO `Insumo_has_actividades_actividades_id_idx`;

-- RenameIndex
ALTER TABLE `mano_de_obra_has_actividades` RENAME INDEX `Mano_de_obra_has_actividades_actividades_id_fkey` TO `Mano_de_obra_has_actividades_actividades_id_idx`;

-- RenameIndex
ALTER TABLE `maquinaria_has_actividades` RENAME INDEX `Maquinaria_has_actividades_actividades_id_fkey` TO `Maquinaria_has_actividades_actividades_id_idx`;

-- RenameIndex
ALTER TABLE `no_conformidades` RENAME INDEX `No_conformidades_inspeccion_id_fkey` TO `No_conformidades_inspeccion_id_idx`;

-- RenameIndex
ALTER TABLE `parcela_documentos` RENAME INDEX `parcela_documentos_parcela_id_fkey` TO `parcela_documentos_parcela_id_idx`;

-- RenameIndex
ALTER TABLE `parcela_fotos` RENAME INDEX `parcela_fotos_parcela_id_fkey` TO `parcela_fotos_parcela_id_idx`;

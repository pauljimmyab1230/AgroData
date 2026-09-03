-- Phase 2: Normalization - FKs for trazabilidad, responsable/inspector, remove computed fields

-- Trazabilidad: Add FK columns
ALTER TABLE `trazabilidad` ADD COLUMN `productor_id` INTEGER NULL;
ALTER TABLE `trazabilidad` ADD COLUMN `parcela_id` INTEGER NULL;
ALTER TABLE `trazabilidad` ADD COLUMN `cultivo_id` VARCHAR(36) NULL;
CREATE INDEX `trazabilidad_productor_id_idx` ON `trazabilidad`(`productor_id`);
CREATE INDEX `trazabilidad_parcela_id_idx` ON `trazabilidad`(`parcela_id`);
CREATE INDEX `trazabilidad_cultivo_id_idx` ON `trazabilidad`(`cultivo_id`);
CREATE INDEX `trazabilidad_lote_id_idx` ON `trazabilidad`(`lote_id`);
ALTER TABLE `trazabilidad` ADD CONSTRAINT `trazabilidad_productor_id_fkey` FOREIGN KEY (`productor_id`) REFERENCES `productores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `trazabilidad` ADD CONSTRAINT `trazabilidad_parcela_id_fkey` FOREIGN KEY (`parcela_id`) REFERENCES `parcelas_productor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `trazabilidad` ADD CONSTRAINT `trazabilidad_cultivo_id_fkey` FOREIGN KEY (`cultivo_id`) REFERENCES `cultivos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `trazabilidad` ADD CONSTRAINT `trazabilidad_lote_id_fkey` FOREIGN KEY (`lote_id`) REFERENCES `lotes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Inspecciones: Add inspector_id FK
ALTER TABLE `inspecciones` ADD COLUMN `inspector_id` VARCHAR(36) NULL;
CREATE INDEX `inspecciones_inspector_id_idx` ON `inspecciones`(`inspector_id`);
ALTER TABLE `inspecciones` ADD CONSTRAINT `inspecciones_inspector_id_fkey` FOREIGN KEY (`inspector_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Acopios: Add acopiador_id FK, remove computed fields
ALTER TABLE `acopios` ADD COLUMN `acopiador_id` VARCHAR(36) NULL;
CREATE INDEX `acopios_acopiador_id_idx` ON `acopios`(`acopiador_id`);
ALTER TABLE `acopios` ADD CONSTRAINT `acopios_acopiador_id_fkey` FOREIGN KEY (`acopiador_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `acopios` DROP COLUMN `peso_promedio`;
ALTER TABLE `acopios` DROP COLUMN `peso_maximo`;
ALTER TABLE `acopios` DROP COLUMN `peso_minimo`;

-- Recepciones: Add responsable_id FK
ALTER TABLE `recepciones` ADD COLUMN `responsable_id` VARCHAR(36) NULL;
CREATE INDEX `recepciones_responsable_id_idx` ON `recepciones`(`responsable_id`);
ALTER TABLE `recepciones` ADD CONSTRAINT `recepciones_responsable_id_fkey` FOREIGN KEY (`responsable_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Procesamientos: Add responsable_id FK
ALTER TABLE `procesamientos` ADD COLUMN `responsable_id` VARCHAR(36) NULL;
CREATE INDEX `procesamientos_responsable_id_idx` ON `procesamientos`(`responsable_id`);
ALTER TABLE `procesamientos` ADD CONSTRAINT `procesamientos_responsable_id_fkey` FOREIGN KEY (`responsable_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

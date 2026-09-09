-- AlterTable: productores - Add ubigeo_id FK
ALTER TABLE `productores` ADD COLUMN `ubigeo_id` INTEGER NULL;
CREATE INDEX `productores_ubigeo_id_idx` ON `productores`(`ubigeo_id`);
ALTER TABLE `productores` ADD CONSTRAINT `productores_ubigeo_id_fkey` FOREIGN KEY (`ubigeo_id`) REFERENCES `ubigeo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable: parcelas_productor - Add ubigeo_id FK
ALTER TABLE `parcelas_productor` ADD COLUMN `ubigeo_id` INTEGER NULL;
CREATE INDEX `parcelas_productor_ubigeo_id_idx` ON `parcelas_productor`(`ubigeo_id`);
ALTER TABLE `parcelas_productor` ADD CONSTRAINT `parcelas_productor_ubigeo_id_fkey` FOREIGN KEY (`ubigeo_id`) REFERENCES `ubigeo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable: sic_capacitaciones - Add ubigeo_id FK
ALTER TABLE `sic_capacitaciones` ADD COLUMN `ubigeo_id` INTEGER NULL;
CREATE INDEX `sic_capacitaciones_ubigeo_id_idx` ON `sic_capacitaciones`(`ubigeo_id`);
ALTER TABLE `sic_capacitaciones` ADD CONSTRAINT `sic_capacitaciones_ubigeo_id_fkey` FOREIGN KEY (`ubigeo_id`) REFERENCES `ubigeo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable: inventario - Add FK constraint for lote_id
CREATE INDEX `inventario_lote_id_idx` ON `inventario`(`lote_id`);
ALTER TABLE `inventario` ADD CONSTRAINT `inventario_lote_id_fkey` FOREIGN KEY (`lote_id`) REFERENCES `lotes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

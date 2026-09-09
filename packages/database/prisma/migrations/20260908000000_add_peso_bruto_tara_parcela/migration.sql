-- AlterTable: acopio - Add peso_bruto, tara, peso_neto columns
ALTER TABLE `acopio` ADD COLUMN `peso_bruto` DECIMAL(10, 2) NOT NULL DEFAULT 0;
ALTER TABLE `acopio` ADD COLUMN `tara` DECIMAL(10, 2) NOT NULL DEFAULT 0;
ALTER TABLE `acopio` ADD COLUMN `peso_neto` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AlterTable: acopio_detalle - Add parcela_id FK
ALTER TABLE `acopio_detalle` ADD COLUMN `parcela_id` INTEGER NULL;
CREATE INDEX `acopio_detalle_parcela_id_idx` ON `acopio_detalle`(`parcela_id`);
ALTER TABLE `acopio_detalle` ADD CONSTRAINT `acopio_detalle_parcela_id_fkey` FOREIGN KEY (`parcela_id`) REFERENCES `parcela`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

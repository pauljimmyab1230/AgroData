-- AlterTable: Add missing columns to productores
ALTER TABLE `productores` ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `productores` ADD COLUMN `created_by` VARCHAR(36) NULL;
ALTER TABLE `productores` ADD COLUMN `updated_by` VARCHAR(36) NULL;

-- AlterTable: Add missing columns to parcelas_productor
ALTER TABLE `parcelas_productor` ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `parcelas_productor` ADD COLUMN `created_by` VARCHAR(36) NULL;
ALTER TABLE `parcelas_productor` ADD COLUMN `updated_by` VARCHAR(36) NULL;

-- AlterEnum: añadir BAJA a TipoMovimiento
ALTER TABLE `kardex_movimiento` MODIFY `tipo` ENUM('ENTRADA', 'SALIDA', 'TRANSFERENCIA', 'AJUSTE', 'BAJA') NOT NULL;

-- CreateTable: tabla de enums (Prisma los crea como tipos nativos de MySQL, no hay tabla)

-- AlterTable: kardex — añadir origen y etapa, convertir categoria a enum
-- Paso 1: añadir columnas nuevas como NULL primero
ALTER TABLE `kardex` ADD COLUMN `origen` ENUM('CAMPO', 'PROCESAMIENTO', 'AJUSTE', 'OTRO') NOT NULL DEFAULT 'CAMPO';
ALTER TABLE `kardex` ADD COLUMN `etapa` ENUM('PRIMARIA', 'SECUNDARIA', 'EMPAQUE') NULL;

-- Paso 2: convertir los valores existentes de categoria al enum
-- Insumo/Semilla -> PRODUCTO_CAMPO (material de entrada)
-- Producto terminado -> PRODUCTO_PROCESADO
UPDATE `kardex` SET `categoria` = 'PRODUCTO_PROCESADO' WHERE `categoria` = 'Producto terminado';
UPDATE `kardex` SET `categoria` = 'PRODUCTO_CAMPO' WHERE `categoria` IN ('Insumo', 'Semilla', 'Producto terminado');

-- Paso 3: alterar la columna categoria al tipo enum
ALTER TABLE `kardex` MODIFY `categoria` ENUM('PRODUCTO_CAMPO', 'PRODUCTO_PROCESADO', 'SUBPRODUCTO', 'ENVASE') NOT NULL DEFAULT 'PRODUCTO_CAMPO';

-- AlterTable: kardex_movimiento — añadir origen, referencia_tipo, referencia_id
ALTER TABLE `kardex_movimiento` ADD COLUMN `origen` ENUM('CAMPO', 'PROCESAMIENTO', 'AJUSTE', 'OTRO') NOT NULL DEFAULT 'AJUSTE';
ALTER TABLE `kardex_movimiento` ADD COLUMN `referencia_tipo` VARCHAR(50) NULL;
ALTER TABLE `kardex_movimiento` ADD COLUMN `referencia_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `kardex_origen_idx` ON `kardex`(`origen`);
CREATE INDEX `kardex_categoria_idx` ON `kardex`(`categoria`);
CREATE INDEX `kardex_movimiento_referencia_tipo_referencia_id_idx` ON `kardex_movimiento`(`referencia_tipo`, `referencia_id`);
CREATE INDEX `kardex_movimiento_origen_idx` ON `kardex_movimiento`(`origen`);

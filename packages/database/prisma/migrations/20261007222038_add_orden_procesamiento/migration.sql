-- CreateTable
CREATE TABLE `operacion_proceso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(500) NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `operacion_proceso_codigo_key`(`codigo`),
    INDEX `operacion_proceso_activo_idx`(`activo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `producto_base` VARCHAR(100) NOT NULL,
    `etapa` ENUM('PRIMARIA', 'SECUNDARIA', 'EMPAQUE') NOT NULL,
    `formato_salida` ENUM('GRANO', 'HARINA', 'HOJUELA', 'POP', 'GRANEL', 'OTRO') NULL,
    `descripcion` TEXT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `receta_codigo_key`(`codigo`),
    INDEX `receta_etapa_idx`(`etapa`),
    INDEX `receta_producto_base_idx`(`producto_base`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receta_operacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `receta_id` INTEGER NOT NULL,
    `operacion_id` INTEGER NOT NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `requerida` BOOLEAN NOT NULL DEFAULT true,
    `parametros_default` TEXT NULL,

    INDEX `receta_operacion_receta_id_idx`(`receta_id`),
    INDEX `receta_operacion_operacion_id_idx`(`operacion_id`),
    UNIQUE INDEX `receta_operacion_receta_id_operacion_id_key`(`receta_id`, `operacion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orden_procesamiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `planta` VARCHAR(100) NOT NULL,
    `responsable` VARCHAR(150) NOT NULL,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `fecha_fin` DATETIME(3) NULL,
    `estado` ENUM('BORRADOR', 'EN_PROCESO', 'FINALIZADO', 'PAUSADA', 'CANCELADA') NOT NULL DEFAULT 'BORRADOR',
    `etapa` ENUM('PRIMARIA', 'SECUNDARIA', 'EMPAQUE') NOT NULL,
    `formato_salida` ENUM('GRANO', 'HARINA', 'HOJUELA', 'POP', 'GRANEL', 'OTRO') NOT NULL DEFAULT 'GRANO',
    `receta_id` INTEGER NULL,
    `orden_origen_id` INTEGER NULL,
    `producto_salida` VARCHAR(150) NOT NULL,
    `peso_entrada` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `peso_salida_total` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `merma_total` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `rendimiento` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `humedad_final` DECIMAL(5, 2) NULL,
    `calidad` ENUM('PRIMERA', 'SEGUNDA', 'TERCERA', 'DESCARTE') NULL,
    `balance_ok` BOOLEAN NOT NULL DEFAULT false,
    `observaciones` TEXT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(36) NULL,
    `updated_by` VARCHAR(36) NULL,

    UNIQUE INDEX `orden_procesamiento_codigo_key`(`codigo`),
    INDEX `orden_procesamiento_receta_id_idx`(`receta_id`),
    INDEX `orden_procesamiento_orden_origen_id_idx`(`orden_origen_id`),
    INDEX `orden_procesamiento_estado_idx`(`estado`),
    INDEX `orden_procesamiento_etapa_idx`(`etapa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orden_operacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orden_id` INTEGER NOT NULL,
    `operacion_id` INTEGER NOT NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `operario` VARCHAR(150) NULL,
    `peso_antes` DECIMAL(12, 2) NULL,
    `peso_despues` DECIMAL(12, 2) NULL,
    `humedad` DECIMAL(5, 2) NULL,
    `resultado` VARCHAR(50) NULL,
    `observaciones` TEXT NULL,
    `completada` BOOLEAN NOT NULL DEFAULT false,

    INDEX `orden_operacion_orden_id_idx`(`orden_id`),
    INDEX `orden_operacion_operacion_id_idx`(`operacion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orden_salida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orden_id` INTEGER NOT NULL,
    `tipo_salida` ENUM('PRODUCTO_BUENO', 'MERMA', 'PIEDRAS', 'SAPONINA', 'ENVASE', 'OTRO') NOT NULL,
    `descripcion` VARCHAR(200) NOT NULL,
    `cantidad` DECIMAL(12, 2) NOT NULL,
    `unidad` ENUM('KG', 'UNIDAD', 'LT') NOT NULL DEFAULT 'KG',
    `humedad` DECIMAL(5, 2) NULL,
    `destino` ENUM('KARDEX', 'DESCARTE', 'REPROCESO', 'SUBPRODUCTO', 'VENTA_DIRECTA') NOT NULL DEFAULT 'SUBPRODUCTO',
    `cuenta_en_balance` BOOLEAN NOT NULL DEFAULT true,
    `observaciones` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `orden_salida_orden_id_idx`(`orden_id`),
    INDEX `orden_salida_tipo_salida_idx`(`tipo_salida`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orden_recepcion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orden_id` INTEGER NOT NULL,
    `recepcion_id` INTEGER NOT NULL,
    `cantidad_asignada` DECIMAL(12, 2) NOT NULL,
    `observaciones` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `orden_recepcion_orden_id_idx`(`orden_id`),
    INDEX `orden_recepcion_recepcion_id_idx`(`recepcion_id`),
    UNIQUE INDEX `orden_recepcion_orden_id_recepcion_id_key`(`orden_id`, `recepcion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `receta_operacion` ADD CONSTRAINT `receta_operacion_receta_id_fkey` FOREIGN KEY (`receta_id`) REFERENCES `receta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receta_operacion` ADD CONSTRAINT `receta_operacion_operacion_id_fkey` FOREIGN KEY (`operacion_id`) REFERENCES `operacion_proceso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_procesamiento` ADD CONSTRAINT `orden_procesamiento_receta_id_fkey` FOREIGN KEY (`receta_id`) REFERENCES `receta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_procesamiento` ADD CONSTRAINT `orden_procesamiento_orden_origen_id_fkey` FOREIGN KEY (`orden_origen_id`) REFERENCES `orden_procesamiento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_operacion` ADD CONSTRAINT `orden_operacion_orden_id_fkey` FOREIGN KEY (`orden_id`) REFERENCES `orden_procesamiento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_operacion` ADD CONSTRAINT `orden_operacion_operacion_id_fkey` FOREIGN KEY (`operacion_id`) REFERENCES `operacion_proceso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_salida` ADD CONSTRAINT `orden_salida_orden_id_fkey` FOREIGN KEY (`orden_id`) REFERENCES `orden_procesamiento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_recepcion` ADD CONSTRAINT `orden_recepcion_orden_id_fkey` FOREIGN KEY (`orden_id`) REFERENCES `orden_procesamiento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_recepcion` ADD CONSTRAINT `orden_recepcion_recepcion_id_fkey` FOREIGN KEY (`recepcion_id`) REFERENCES `recepcion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

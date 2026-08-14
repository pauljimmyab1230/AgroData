-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `rol_sic` ENUM('RESPONSABLE_SIC', 'INSPECTOR', 'COMITE_DECISION', 'TECNICO_CAMPO', 'ACOPIADOR', 'CAPACITADOR') NULL;

-- CreateTable
CREATE TABLE `sic_capacitaciones` (
    `id` VARCHAR(36) NOT NULL,
    `codigo` VARCHAR(20) NOT NULL,
    `tipo` ENUM('PRODUCTORES', 'PERSONAL_SIC') NOT NULL,
    `tema` VARCHAR(200) NOT NULL,
    `descripcion` TEXT NULL,
    `capacitador` VARCHAR(150) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `hora_inicio` VARCHAR(5) NULL,
    `hora_fin` VARCHAR(5) NULL,
    `duracion_horas` DECIMAL(5, 2) NULL,
    `lugar` VARCHAR(200) NOT NULL,
    `departamento` VARCHAR(100) NULL,
    `provincia` VARCHAR(100) NULL,
    `distrito` VARCHAR(100) NULL,
    `material_entregado` TEXT NULL,
    `observaciones` TEXT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_by` VARCHAR(36) NULL,
    `updated_by` VARCHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sic_capacitaciones_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sic_capacitacion_participantes` (
    `id` VARCHAR(36) NOT NULL,
    `capacitacion_id` VARCHAR(36) NOT NULL,
    `productor_id` VARCHAR(36) NULL,
    `usuario_id` VARCHAR(36) NULL,
    `asistio` BOOLEAN NOT NULL DEFAULT false,
    `firma_url` VARCHAR(500) NULL,
    `observaciones` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `sic_capacitacion_participantes_capacitacion_id_idx`(`capacitacion_id`),
    INDEX `sic_capacitacion_participantes_productor_id_idx`(`productor_id`),
    INDEX `sic_capacitacion_participantes_usuario_id_idx`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sic_capacitacion_participantes` ADD CONSTRAINT `sic_capacitacion_participantes_capacitacion_id_fkey` FOREIGN KEY (`capacitacion_id`) REFERENCES `sic_capacitaciones`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sic_capacitacion_participantes` ADD CONSTRAINT `sic_capacitacion_participantes_productor_id_fkey` FOREIGN KEY (`productor_id`) REFERENCES `productores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sic_capacitacion_participantes` ADD CONSTRAINT `sic_capacitacion_participantes_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

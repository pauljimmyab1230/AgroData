-- AlterTable
ALTER TABLE `parcelas_productor`
    ADD COLUMN `area_certificada` DECIMAL(10, 2) NULL,
    ADD COLUMN `comunidad` VARCHAR(150) NULL,
    ADD COLUMN `sector` VARCHAR(150) NULL,
    ADD COLUMN `altitud` VARCHAR(50) NULL,
    ADD COLUMN `departamento` VARCHAR(100) NULL,
    ADD COLUMN `provincia` VARCHAR(100) NULL,
    ADD COLUMN `distrito` VARCHAR(100) NULL,
    ADD COLUMN `centro_poblado` VARCHAR(150) NULL,
    ADD COLUMN `ubigeo` VARCHAR(6) NULL,
    ADD COLUMN `latitud` VARCHAR(30) NULL,
    ADD COLUMN `longitud` VARCHAR(30) NULL,
    ADD COLUMN `precision_gps` VARCHAR(20) NULL,
    ADD COLUMN `tipo_suelo` VARCHAR(100) NULL,
    ADD COLUMN `textura` VARCHAR(50) NULL,
    ADD COLUMN `pendiente` VARCHAR(100) NULL,
    ADD COLUMN `fuente_agua` VARCHAR(100) NULL,
    ADD COLUMN `sistema_riego` VARCHAR(100) NULL,
    ADD COLUMN `zona_agroecologica` VARCHAR(100) NULL,
    ADD COLUMN `disponibilidad_agua` VARCHAR(50) NULL,
    ADD COLUMN `observaciones` TEXT NULL,
    ADD COLUMN `area_calculada` VARCHAR(50) NULL,
    ADD COLUMN `perimetro` VARCHAR(50) NULL,
    ADD COLUMN `vertices` INTEGER NULL,
    ADD COLUMN `fecha_levantamiento` DATETIME(3) NULL,
    ADD COLUMN `responsable` VARCHAR(150) NULL,
    MODIFY `ubicacion` VARCHAR(200) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `parcelas_productor_codigo_key` ON `parcelas_productor`(`codigo`);

-- CreateTable
CREATE TABLE `parcela_documentos` (
    `id` VARCHAR(36) NOT NULL,
    `parcela_id` VARCHAR(36) NOT NULL,
    `tipo` VARCHAR(100) NOT NULL,
    `nombre_archivo` VARCHAR(255) NOT NULL,
    `ruta_archivo` VARCHAR(500) NOT NULL,
    `tamano_bytes` INTEGER NOT NULL,
    `mime_type` VARCHAR(100) NOT NULL,
    `estado` VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parcela_fotos` (
    `id` VARCHAR(36) NOT NULL,
    `parcela_id` VARCHAR(36) NOT NULL,
    `titulo` VARCHAR(150) NOT NULL,
    `descripcion` VARCHAR(500) NULL,
    `fecha` DATETIME(3) NULL,
    `autor` VARCHAR(150) NULL,
    `observaciones` TEXT NULL,
    `ruta_archivo` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `parcela_documentos` ADD CONSTRAINT `parcela_documentos_parcela_id_fkey` FOREIGN KEY (`parcela_id`) REFERENCES `parcelas_productor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parcela_fotos` ADD CONSTRAINT `parcela_fotos_parcela_id_fkey` FOREIGN KEY (`parcela_id`) REFERENCES `parcelas_productor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

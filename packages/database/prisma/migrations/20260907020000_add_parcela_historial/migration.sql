-- CreateTable
CREATE TABLE `parcela_historial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parcela_id` INTEGER NOT NULL,
    `tipo` VARCHAR(50) NOT NULL,
    `titulo` VARCHAR(200) NOT NULL,
    `descripcion` TEXT NULL,
    `usuario` VARCHAR(150) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `parcela_historial_parcela_id_idx` ON `parcela_historial`(`parcela_id`);

-- CreateIndex
CREATE INDEX `parcela_historial_created_at_idx` ON `parcela_historial`(`created_at`);

-- AddForeignKey
ALTER TABLE `parcela_historial` ADD CONSTRAINT `parcela_historial_parcela_id_fkey` FOREIGN KEY (`parcela_id`) REFERENCES `parcelas_productor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

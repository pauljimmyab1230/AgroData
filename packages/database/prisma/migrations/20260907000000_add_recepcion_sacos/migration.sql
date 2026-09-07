-- CreateTable
CREATE TABLE `recepcion_sacos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recepcion_id` INTEGER NOT NULL,
    `codigo` VARCHAR(50) NOT NULL,
    `peso` DECIMAL(10, 2) NOT NULL,
    `observaciones` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `recepcion_sacos_recepcion_id_idx`(`recepcion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `recepcion_sacos` ADD CONSTRAINT `recepcion_sacos_recepcion_id_fkey` FOREIGN KEY (`recepcion_id`) REFERENCES `recepcion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

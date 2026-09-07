-- Eliminar tablas de lotes y movimientos
DROP TABLE IF EXISTS `Movimiento`;
DROP TABLE IF EXISTS `lote`;

-- Renombrar tabla inventario a kardex
RENAME TABLE `inventario` TO `kardex`;

-- Crear tabla kardex_movimiento
CREATE TABLE `kardex_movimiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('ENTRADA', 'SALIDA', 'TRANSFERENCIA', 'AJUSTE') NOT NULL,
    `cantidad` DECIMAL(10, 2) NOT NULL,
    `saldo_anterior` DECIMAL(10, 2) NOT NULL,
    `saldo_posterior` DECIMAL(10, 2) NOT NULL,
    `destino` VARCHAR(200) NULL,
    `referencia` VARCHAR(200) NULL,
    `responsable` VARCHAR(150) NULL,
    `observaciones` TEXT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `kardex_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`kardex_id`) REFERENCES `kardex`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `kardex_movimiento_kardex_id_idx` (`kardex_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Migrar datos existentes de inventario: crear movimientos iniciales para items con cantidad_actual > 0
INSERT INTO `kardex_movimiento` (`tipo`, `cantidad`, `saldo_anterior`, `saldo_posterior`, `referencia`, `fecha`, `created_at`, `kardex_id`)
SELECT
    'ENTRADA',
    `cantidad_actual`,
    0,
    `cantidad_actual`,
    'Migración desde inventario',
    `fecha_ingreso`,
    NOW(3),
    `id`
FROM `kardex`
WHERE `cantidad_actual` > 0;

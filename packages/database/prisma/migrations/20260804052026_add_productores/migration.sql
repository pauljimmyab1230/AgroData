-- CreateTable
CREATE TABLE `productores` (
    `id` VARCHAR(36) NOT NULL,
    `codigo` VARCHAR(20) NOT NULL,
    `dni` VARCHAR(8) NOT NULL,
    `nombres` VARCHAR(100) NOT NULL,
    `apellido_paterno` VARCHAR(100) NOT NULL,
    `apellido_materno` VARCHAR(100) NOT NULL,
    `sexo` ENUM('MASCULINO', 'FEMENINO') NOT NULL,
    `fecha_nacimiento` DATETIME(3) NOT NULL,
    `estado_civil` ENUM('SOLTERO', 'CASADO', 'CONVIVIENTE', 'VIUDO') NOT NULL,
    `telefono` VARCHAR(20) NULL,
    `correo` VARCHAR(150) NULL,
    `departamento` VARCHAR(100) NOT NULL,
    `provincia` VARCHAR(100) NOT NULL,
    `distrito` VARCHAR(100) NOT NULL,
    `comunidad` VARCHAR(150) NOT NULL,
    `direccion` TEXT NULL,
    `nivel_educativo` ENUM('SIN_ESTUDIOS', 'PRIMARIA', 'SECUNDARIA', 'TECNICO', 'UNIVERSITARIO') NOT NULL,
    `idioma_principal` ENUM('QUECHUA', 'ESPANOL', 'OTRO', 'NINGUNO') NOT NULL,
    `idioma_secundario` ENUM('QUECHUA', 'ESPANOL', 'OTRO', 'NINGUNO') NOT NULL DEFAULT 'NINGUNO',
    `estado` ENUM('ACTIVO', 'INACTIVO', 'SUSPENDIDO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_ingreso` DATETIME(3) NOT NULL,
    `organizacion` VARCHAR(200) NOT NULL,
    `cargo` ENUM('SOCIO', 'DIRECTIVO', 'PRESIDENTE', 'VICEPRESIDENTE', 'SECRETARIO', 'TESORERO', 'VOCAL', 'OTRO') NOT NULL,
    `foto_url` VARCHAR(500) NULL,
    `firma_url` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `productores_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `familiares_productor` (
    `id` VARCHAR(36) NOT NULL,
    `productor_id` VARCHAR(36) NOT NULL,
    `nombres` VARCHAR(200) NOT NULL,
    `parentesco` VARCHAR(50) NOT NULL,
    `dni` VARCHAR(8) NULL,
    `sexo` ENUM('MASCULINO', 'FEMENINO') NOT NULL,
    `fecha_nacimiento` DATETIME(3) NOT NULL,
    `ocupacion` VARCHAR(100) NULL,
    `nivel_educativo` ENUM('SIN_ESTUDIOS', 'PRIMARIA', 'SECUNDARIA', 'TECNICO', 'UNIVERSITARIO') NULL,
    `telefono` VARCHAR(20) NULL,
    `dependiente` BOOLEAN NOT NULL DEFAULT false,
    `vive_con_productor` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parcelas_productor` (
    `id` VARCHAR(36) NOT NULL,
    `productor_id` VARCHAR(36) NOT NULL,
    `codigo` VARCHAR(20) NOT NULL,
    `nombre` VARCHAR(200) NOT NULL,
    `cultivo` VARCHAR(100) NOT NULL,
    `area` DECIMAL(10, 2) NOT NULL,
    `area_unidad` VARCHAR(10) NOT NULL DEFAULT 'ha',
    `ubicacion` VARCHAR(200) NOT NULL,
    `certificacion` ENUM('ORGANICA', 'EN_TRANSICION', 'CONVENCIONAL') NOT NULL DEFAULT 'CONVENCIONAL',
    `estado` ENUM('ACTIVA', 'INACTIVA') NOT NULL DEFAULT 'ACTIVA',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentos_productor` (
    `id` VARCHAR(36) NOT NULL,
    `productor_id` VARCHAR(36) NOT NULL,
    `tipo` VARCHAR(100) NOT NULL,
    `categoria` ENUM('PERSONAL', 'INSTITUCIONAL', 'OTROS') NOT NULL,
    `nombre_archivo` VARCHAR(255) NOT NULL,
    `ruta_archivo` VARCHAR(500) NOT NULL,
    `tamano_bytes` INTEGER NOT NULL,
    `mime_type` VARCHAR(100) NOT NULL,
    `estado` ENUM('PENDIENTE', 'VERIFICADO', 'RECHAZADO') NOT NULL DEFAULT 'PENDIENTE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `familiares_productor` ADD CONSTRAINT `familiares_productor_productor_id_fkey` FOREIGN KEY (`productor_id`) REFERENCES `productores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parcelas_productor` ADD CONSTRAINT `parcelas_productor_productor_id_fkey` FOREIGN KEY (`productor_id`) REFERENCES `productores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos_productor` ADD CONSTRAINT `documentos_productor_productor_id_fkey` FOREIGN KEY (`productor_id`) REFERENCES `productores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

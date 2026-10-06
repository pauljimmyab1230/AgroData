-- CreateTable
CREATE TABLE `Productor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
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
    `material_vivienda` VARCHAR(50) NULL,
    `acceso_agua` VARCHAR(10) NULL,
    `acceso_energia` VARCHAR(10) NULL,
    `acceso_internet` VARCHAR(10) NULL,
    `seguro_salud` VARCHAR(50) NULL,
    `acceso_credito` VARCHAR(10) NULL,
    `servicio_sanitario` VARCHAR(50) NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO', 'SUSPENDIDO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_ingreso` DATETIME(3) NOT NULL,
    `organizacion` VARCHAR(200) NOT NULL,
    `cargo` ENUM('SOCIO', 'DIRECTIVO', 'PRESIDENTE', 'VICEPRESIDENTE', 'SECRETARIO', 'TESORERO', 'VOCAL', 'OTRO') NOT NULL,
    `foto_url` VARCHAR(500) NULL,
    `firma_url` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_by` VARCHAR(36) NULL,
    `updated_by` VARCHAR(36) NULL,
    `ubigeo_id` INTEGER NULL,

    UNIQUE INDEX `Productor_codigo_key`(`codigo`),
    UNIQUE INDEX `Productor_dni_key`(`dni`),
    INDEX `Productor_ubigeo_id_idx`(`ubigeo_id`),
    INDEX `Productor_created_by_idx`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `familiar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
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
    `productor_id` INTEGER NOT NULL,

    INDEX `familiar_productor_id_idx`(`productor_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(100) NOT NULL,
    `categoria` ENUM('PERSONAL', 'INSTITUCIONAL', 'OTROS') NOT NULL,
    `nombre_archivo` VARCHAR(255) NOT NULL,
    `ruta_archivo` VARCHAR(500) NOT NULL,
    `tamano_bytes` INTEGER NOT NULL,
    `mime_type` VARCHAR(100) NOT NULL,
    `estado` ENUM('PENDIENTE', 'VERIFICADO', 'RECHAZADO') NOT NULL DEFAULT 'PENDIENTE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `productor_id` INTEGER NOT NULL,

    INDEX `documentos_productor_id_idx`(`productor_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parcela` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `nombre` VARCHAR(200) NOT NULL,
    `cultivo` VARCHAR(100) NOT NULL,
    `area` DECIMAL(10, 2) NOT NULL,
    `area_certificada` DECIMAL(10, 2) NULL,
    `area_unidad` VARCHAR(10) NOT NULL DEFAULT 'ha',
    `ubicacion` VARCHAR(200) NULL,
    `certificacion` ENUM('ORGANICA', 'EN_TRANSICION', 'CONVENCIONAL') NOT NULL DEFAULT 'CONVENCIONAL',
    `estado` ENUM('ACTIVA', 'INACTIVA') NOT NULL DEFAULT 'ACTIVA',
    `comunidad` VARCHAR(150) NULL,
    `sector` VARCHAR(150) NULL,
    `altitud` VARCHAR(50) NULL,
    `departamento` VARCHAR(100) NULL,
    `provincia` VARCHAR(100) NULL,
    `distrito` VARCHAR(100) NULL,
    `centro_poblado` VARCHAR(150) NULL,
    `ubigeo` VARCHAR(6) NULL,
    `latitud` VARCHAR(30) NULL,
    `longitud` VARCHAR(30) NULL,
    `precision_gps` VARCHAR(20) NULL,
    `tipo_suelo` VARCHAR(100) NULL,
    `textura` VARCHAR(50) NULL,
    `pendiente` VARCHAR(100) NULL,
    `fuente_agua` VARCHAR(100) NULL,
    `sistema_riego` VARCHAR(100) NULL,
    `zona_agroecologica` VARCHAR(100) NULL,
    `disponibilidad_agua` VARCHAR(50) NULL,
    `observaciones` TEXT NULL,
    `area_calculada` VARCHAR(50) NULL,
    `perimetro` VARCHAR(50) NULL,
    `vertices` INTEGER NULL,
    `poligono` TEXT NULL,
    `fecha_levantamiento` DATETIME(3) NULL,
    `responsable` VARCHAR(150) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(36) NULL,
    `updated_by` VARCHAR(36) NULL,
    `acreditacion` VARCHAR(50) NULL,
    `utm_este` VARCHAR(20) NULL,
    `utm_norte` VARCHAR(20) NULL,
    `utm_zona` VARCHAR(10) NULL,
    `productores_id` INTEGER NOT NULL,
    `ubigeo_id` INTEGER NULL,

    UNIQUE INDEX `parcela_codigo_key`(`codigo`),
    INDEX `parcela_productores_id_idx`(`productores_id`),
    INDEX `parcela_ubigeo_id_idx`(`ubigeo_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parcela_documentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(100) NOT NULL,
    `nombre_archivo` VARCHAR(255) NOT NULL,
    `ruta_archivo` VARCHAR(500) NOT NULL,
    `tamano_bytes` INTEGER NOT NULL,
    `mime_type` VARCHAR(100) NOT NULL,
    `estado` VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `parcela_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parcela_fotos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(150) NOT NULL,
    `descripcion` VARCHAR(500) NULL,
    `fecha` DATETIME(3) NULL,
    `autor` VARCHAR(150) NULL,
    `observaciones` TEXT NULL,
    `ruta_archivo` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `parcela_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parcela_historial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parcela_id` INTEGER NOT NULL,
    `tipo` VARCHAR(50) NOT NULL,
    `titulo` VARCHAR(200) NOT NULL,
    `descripcion` TEXT NULL,
    `usuario` VARCHAR(150) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `parcela_historial_parcela_id_idx`(`parcela_id`),
    INDEX `parcela_historial_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campanias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `nombre` VARCHAR(200) NOT NULL,
    `anio_agricola` VARCHAR(10) NOT NULL,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `fecha_fin` DATETIME(3) NOT NULL,
    `descripcion` TEXT NULL,
    `estado` ENUM('PLANIFICADA', 'ACTIVA', 'FINALIZADA', 'CANCELADA') NOT NULL DEFAULT 'PLANIFICADA',
    `responsable` VARCHAR(150) NOT NULL,
    `tecnico_coordinador` VARCHAR(150) NOT NULL,
    `objetivo` TEXT NULL,
    `permitir_cultivos` BOOLEAN NOT NULL DEFAULT true,
    `permitir_actividades` BOOLEAN NOT NULL DEFAULT true,
    `permitir_cosechas` BOOLEAN NOT NULL DEFAULT true,
    `permitir_inspecciones` BOOLEAN NOT NULL DEFAULT true,
    `permitir_acopio` BOOLEAN NOT NULL DEFAULT true,
    `permitir_procesamiento` BOOLEAN NOT NULL DEFAULT true,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `activa` BOOLEAN NOT NULL DEFAULT false,
    `observaciones` TEXT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(36) NULL,
    `updated_by` VARCHAR(36) NULL,

    UNIQUE INDEX `campanias_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cultivo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `cultivo` VARCHAR(100) NOT NULL,
    `variedad` VARCHAR(100) NULL,
    `area_sembrada` DECIMAL(10, 2) NULL,
    `fecha_siembra` DATETIME(3) NULL,
    `metodo_siembra` ENUM('DIRECTA', 'TRASPLANTE', 'ALMACIGO', 'OTRO') NULL,
    `sistema_productivo` ENUM('AGROECOLOGICO', 'ORGANICO', 'CONVENCIONAL', 'EN_TRANSICION') NULL,
    `tipo_agricultura` ENUM('TRADICIONAL', 'TECNIFICADA', 'MIXTA') NULL,
    `certificacion` ENUM('ORGANICA', 'EN_TRANSICION', 'SIN_CERTIFICAR') NULL DEFAULT 'SIN_CERTIFICAR',
    `procedencia_semilla` ENUM('CERTIFICADA', 'COMUN', 'PRODUCIDA_EN_CAMPO', 'CONSERVADA_POR_AGRICULTOR') NULL,
    `cantidad_semilla` DECIMAL(10, 2) NULL,
    `unidad_semilla` VARCHAR(10) NULL,
    `fecha_cosecha` DATETIME(3) NULL,
    `estado` ENUM('EN_CRECIMIENTO', 'COSECHADO', 'PERDIDO') NOT NULL DEFAULT 'EN_CRECIMIENTO',
    `observaciones` TEXT NULL,
    `rendimiento_esperado` DECIMAL(10, 2) NULL,
    `produccion_estimada` DECIMAL(10, 2) NULL,
    `destino_produccion` ENUM('VENTA_COOPERATIVA', 'COMERCIALIZACION_LOCAL', 'AUTOCONSUMO', 'SEMILLA') NULL,
    `distanciamiento_surcos` VARCHAR(50) NULL,
    `distanciamiento_plantas` VARCHAR(50) NULL,
    `densidad_siembra` VARCHAR(50) NULL,
    `tipo_semilla` VARCHAR(100) NULL,
    `lote_semilla` VARCHAR(100) NULL,
    `proveedor_semilla` VARCHAR(150) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(36) NULL,
    `updated_by` VARCHAR(36) NULL,
    `parcela_id` INTEGER NOT NULL,
    `campania_id` INTEGER NOT NULL,

    UNIQUE INDEX `cultivo_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `actividades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `tipo_actividad` ENUM('PREPARACION_TERRENO', 'SIEMBRA', 'RESIEMBRA', 'FERTILIZACION', 'COMPOSTAJE', 'APLICACION_BIOLES', 'CONTROL_BIOLOGICO', 'MANEJO_PLAGAS', 'MANEJO_ENFERMEDADES', 'DESHIERBIE', 'RIEGO', 'PODA', 'APORQUE', 'COSECHA', 'OTRA') NOT NULL,
    `descripcion` TEXT NULL,
    `responsable_tecnico` VARCHAR(150) NOT NULL,
    `hora_inicio` VARCHAR(5) NULL,
    `hora_fin` VARCHAR(5) NULL,
    `duracion_estimada` VARCHAR(50) NULL,
    `prioridad` ENUM('ALTA', 'MEDIA', 'BAJA') NOT NULL DEFAULT 'MEDIA',
    `estado` ENUM('PROGRAMADA', 'EN_PROCESO', 'COMPLETADA') NOT NULL DEFAULT 'PROGRAMADA',
    `jornales` INTEGER NULL DEFAULT 0,
    `latitud` VARCHAR(30) NULL,
    `longitud` VARCHAR(30) NULL,
    `altitud` VARCHAR(50) NULL,
    `precision_gps` VARCHAR(20) NULL,
    `observaciones_tecnicas` TEXT NULL,
    `recomendaciones` TEXT NULL,
    `objetivo` TEXT NULL,
    `resultado` TEXT NULL,
    `proxima_actividad` VARCHAR(200) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(36) NULL,
    `updated_by` VARCHAR(36) NULL,
    `cultivo_id` INTEGER NOT NULL,

    UNIQUE INDEX `actividades_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Insumo` (
    `id` VARCHAR(36) NOT NULL,
    `producto` VARCHAR(150) NOT NULL,
    `categoria` VARCHAR(100) NULL,
    `fabricante` VARCHAR(150) NULL,
    `cantidad` DECIMAL(10, 2) NULL,
    `unidad` VARCHAR(20) NULL,
    `lote` VARCHAR(100) NULL,
    `costo_unitario` DECIMAL(10, 2) NULL,
    `costo_total` DECIMAL(10, 2) NULL,
    `observaciones` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mano_de_obra` (
    `id` VARCHAR(36) NOT NULL,
    `trabajador` VARCHAR(150) NOT NULL,
    `funcion` VARCHAR(100) NULL,
    `jornales` DECIMAL(5, 2) NULL,
    `horas` DECIMAL(5, 2) NULL,
    `observaciones` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Maquinaria` (
    `id` VARCHAR(36) NOT NULL,
    `equipo` VARCHAR(150) NOT NULL,
    `operador` VARCHAR(150) NULL,
    `horas_uso` DECIMAL(5, 2) NULL,
    `combustible` DECIMAL(10, 2) NULL,
    `observaciones` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Insumo_has_actividades` (
    `insumo_id` VARCHAR(36) NOT NULL,
    `actividades_id` INTEGER NOT NULL,

    PRIMARY KEY (`insumo_id`, `actividades_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mano_de_obra_has_actividades` (
    `mano_de_obra_id` VARCHAR(36) NOT NULL,
    `actividades_id` INTEGER NOT NULL,

    PRIMARY KEY (`mano_de_obra_id`, `actividades_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Maquinaria_has_actividades` (
    `maquinaria_id` VARCHAR(36) NOT NULL,
    `actividades_id` INTEGER NOT NULL,

    PRIMARY KEY (`maquinaria_id`, `actividades_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `acopio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `acopiador` VARCHAR(150) NOT NULL,
    `vehiculo` VARCHAR(100) NULL,
    `ruta_acopio` VARCHAR(200) NULL,
    `total_sacos` INTEGER NOT NULL DEFAULT 0,
    `peso_total` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `peso_bruto` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `tara` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `peso_neto` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `estado` ENUM('EN_CAMPO', 'EN_TRANSITO', 'RECIBIDO') NOT NULL DEFAULT 'EN_CAMPO',
    `observaciones` TEXT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(36) NULL,
    `updated_by` VARCHAR(36) NULL,

    UNIQUE INDEX `acopio_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `acopio_detalle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `acopio_id` INTEGER NOT NULL,
    `productor_id` INTEGER NOT NULL,
    `cultivo_id` INTEGER NOT NULL,
    `parcela_id` INTEGER NULL,
    `total_sacos` INTEGER NOT NULL DEFAULT 0,
    `peso_total` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `observaciones` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `acopio_detalle_acopio_id_idx`(`acopio_id`),
    INDEX `acopio_detalle_productor_id_idx`(`productor_id`),
    INDEX `acopio_detalle_cultivo_id_idx`(`cultivo_id`),
    INDEX `acopio_detalle_parcela_id_idx`(`parcela_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Saco` (
    `id` VARCHAR(36) NOT NULL,
    `codigo` VARCHAR(50) NOT NULL,
    `peso` DECIMAL(10, 2) NOT NULL,
    `observaciones` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `acopio_detalle_id` INTEGER NOT NULL,

    INDEX `Saco_acopio_detalle_id_idx`(`acopio_detalle_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recepcion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `lote_productor` VARCHAR(100) NULL,
    `fecha` DATETIME(3) NOT NULL,
    `responsable` VARCHAR(150) NOT NULL,
    `planta` VARCHAR(100) NOT NULL,
    `sacos` INTEGER NOT NULL DEFAULT 0,
    `peso_campo` DECIMAL(10, 2) NULL,
    `peso_bruto` DECIMAL(10, 2) NULL,
    `tara` DECIMAL(10, 2) NULL,
    `peso_neto` DECIMAL(10, 2) NULL,
    `diferencia` DECIMAL(10, 2) NULL,
    `merma` DECIMAL(5, 2) NULL,
    `humedad` DECIMAL(5, 2) NULL,
    `impurezas` DECIMAL(5, 2) NULL,
    `materia_extrana` DECIMAL(5, 2) NULL,
    `color` VARCHAR(50) NULL,
    `olor` VARCHAR(50) NULL,
    `presencia_insectos` VARCHAR(50) NULL,
    `estado_producto` ENUM('EXCELENTE', 'BUENO', 'REGULAR', 'RECHAZADO') NULL,
    `categoria` ENUM('PRIMERA', 'SEGUNDA', 'INDUSTRIAL', 'DESCARTE') NULL,
    `destino` ENUM('PROCESAMIENTO', 'ALMACEN_TEMPORAL', 'RECHAZADO') NULL,
    `resultado` ENUM('ACEPTADO', 'ACEPTADO_CON_OBSERVACIONES', 'RECHAZADO') NULL,
    `motivo` TEXT NULL,
    `estado` ENUM('PENDIENTE_PESAJE', 'EN_CONTROL_CALIDAD', 'DISPONIBLE', 'RECHAZADA') NOT NULL DEFAULT 'PENDIENTE_PESAJE',
    `observaciones` TEXT NULL,
    `documento_firmado` BOOLEAN NOT NULL DEFAULT false,
    `firma_responsable_url` VARCHAR(500) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(36) NULL,
    `updated_by` VARCHAR(36) NULL,
    `acopio_id` INTEGER NULL,

    UNIQUE INDEX `recepcion_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recepcion_saco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recepcion_id` INTEGER NOT NULL,
    `codigo` VARCHAR(50) NOT NULL,
    `peso` DECIMAL(10, 2) NOT NULL,
    `observaciones` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `recepcion_saco_recepcion_id_idx`(`recepcion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inspecciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `inspector` VARCHAR(150) NOT NULL,
    `estado` ENUM('PENDIENTE', 'APROBADA', 'NO_CONFORME') NOT NULL DEFAULT 'PENDIENTE',
    `resultado` ENUM('CONFORME', 'CONFORME_CON_OBSERVACIONES', 'NO_CONFORME') NULL,
    `latitud` VARCHAR(30) NULL,
    `longitud` VARCHAR(30) NULL,
    `altitud` VARCHAR(50) NULL,
    `precision_gps` VARCHAR(20) NULL,
    `observaciones` TEXT NULL,
    `comentarios_productor` TEXT NULL,
    `recomendaciones` TEXT NULL,
    `prioridad_recomendacion` VARCHAR(150) NULL,
    `responsable_recomendacion` VARCHAR(150) NULL,
    `fecha_recomendacion` DATETIME(3) NULL,
    `riesgo_general` ENUM('BAJO', 'MEDIO', 'ALTO') NULL DEFAULT 'BAJO',
    `resumen_ejecutivo` TEXT NULL,
    `fecha_proxima_inspeccion` DATETIME(3) NULL,
    `nivel_cumplimiento` VARCHAR(50) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(36) NULL,
    `updated_by` VARCHAR(36) NULL,
    `cultivo_id` INTEGER NOT NULL,

    UNIQUE INDEX `Inspecciones_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspeccion_checklist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `criterio` VARCHAR(200) NOT NULL,
    `cumplimiento` ENUM('CUMPLE', 'NO_CUMPLE', 'NO_APLICA') NULL,
    `riesgo` ENUM('BAJO', 'MEDIO', 'ALTO') NOT NULL DEFAULT 'BAJO',
    `observacion` TEXT NULL,
    `evidencia` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `inspeccion_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `No_conformidades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `tipo` VARCHAR(100) NOT NULL,
    `categoria` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `severidad` ENUM('LEVE', 'MODERADA', 'CRITICA') NOT NULL DEFAULT 'LEVE',
    `responsable` VARCHAR(150) NOT NULL,
    `fecha_compromiso` DATETIME(3) NULL,
    `estado` ENUM('PENDIENTE', 'EN_PROCESO', 'CORREGIDA', 'VERIFICADA') NOT NULL DEFAULT 'PENDIENTE',
    `accion_correctiva` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `inspeccion_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Acciones_correctivas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accion` TEXT NOT NULL,
    `responsable` VARCHAR(150) NOT NULL,
    `fecha_inicio` DATETIME(3) NULL,
    `fecha_limite` DATETIME(3) NULL,
    `estado` ENUM('PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'VERIFICADA') NOT NULL DEFAULT 'PENDIENTE',
    `observaciones` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `no_conformidad_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evidencia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `descripcion` VARCHAR(500) NULL,
    `tipo` VARCHAR(100) NULL,
    `ruta_archivo` VARCHAR(500) NULL,
    `fecha` DATETIME(3) NULL,
    `responsable` VARCHAR(150) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `inspeccion_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `procesamiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `fecha_fin` DATETIME(3) NOT NULL,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `producto` VARCHAR(100) NOT NULL,
    `responsable` VARCHAR(150) NOT NULL,
    `planta` VARCHAR(100) NOT NULL,
    `linea_procesamiento` ENUM('GRANOS', 'TUBERCULOS', 'LEGUMBRES', 'SEMILLAS') NOT NULL,
    `tipo_proceso` ENUM('SECADO', 'LIMPIEZA', 'MOLIENDA', 'TOSTADO', 'EMPAQUE', 'TRANSFORMACION') NOT NULL,
    `estado` ENUM('REGISTRADA', 'EN_PROCESO', 'FINALIZADO', 'PAUSADA', 'CANCELADA') NOT NULL DEFAULT 'REGISTRADA',
    `observaciones` TEXT NULL,
    `peso_entrada` DECIMAL(10, 2) NULL,
    `peso_salida` DECIMAL(10, 2) NULL,
    `merma` DECIMAL(10, 2) NULL,
    `rendimiento` DECIMAL(5, 2) NULL,
    `producto_base` VARCHAR(100) NULL,
    `calidad_producto` ENUM('PRIMERA', 'SEGUNDA', 'TERCERA', 'DESCARTE') NULL,
    `peso_final` DECIMAL(10, 2) NULL,
    `humedad_final` DECIMAL(5, 2) NULL,
    `recepcion_id` INTEGER NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(36) NULL,
    `updated_by` VARCHAR(36) NULL,

    UNIQUE INDEX `procesamiento_codigo_key`(`codigo`),
    INDEX `procesamiento_recepcion_id_idx`(`recepcion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kardex` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `producto` VARCHAR(200) NOT NULL,
    `categoria` VARCHAR(100) NOT NULL,
    `unidad` VARCHAR(10) NOT NULL DEFAULT 'kg',
    `cantidad_actual` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `cantidad_minima` DECIMAL(10, 2) NULL,
    `cantidad_maxima` DECIMAL(10, 2) NULL,
    `ubicacion` VARCHAR(200) NULL,
    `estado` ENUM('DISPONIBLE', 'RESERVADO', 'CONSUMIDO', 'VENCIDO') NOT NULL DEFAULT 'DISPONIBLE',
    `fecha_ingreso` DATETIME(3) NOT NULL,
    `fecha_vencimiento` DATETIME(3) NULL,
    `proveedor` VARCHAR(200) NULL,
    `costo_unitario` DECIMAL(10, 2) NULL,
    `observaciones` TEXT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(36) NULL,
    `updated_by` VARCHAR(36) NULL,

    UNIQUE INDEX `kardex_codigo_key`(`codigo`),
    INDEX `kardex_activo_estado_categoria_idx`(`activo`, `estado`, `categoria`),
    INDEX `kardex_activo_created_at_idx`(`activo`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
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

    INDEX `kardex_movimiento_kardex_id_fecha_idx`(`kardex_id`, `fecha`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `catalogos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(50) NOT NULL,
    `nombre` VARCHAR(500) NOT NULL,
    `descripcion` VARCHAR(500) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `created_by` VARCHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `updated_by` VARCHAR(36) NULL,

    INDEX `catalogos_tipo_idx`(`tipo`),
    UNIQUE INDEX `catalogos_tipo_nombre_key`(`tipo`, `nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ubigeo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ubigeo` CHAR(6) NOT NULL,
    `dpto` VARCHAR(32) NOT NULL,
    `prov` VARCHAR(32) NOT NULL,
    `distrito` VARCHAR(32) NOT NULL,

    UNIQUE INDEX `ubigeo_ubigeo_key`(`ubigeo`),
    INDEX `ubigeo_dpto_idx`(`dpto`),
    INDEX `ubigeo_prov_idx`(`prov`),
    INDEX `ubigeo_distrito_idx`(`distrito`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(36) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `rol` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `rol_sic` ENUM('RESPONSABLE_SIC', 'INSPECTOR', 'COMITE_DECISION', 'TECNICO_CAMPO', 'ACOPIADOR', 'CAPACITADOR') NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Productor` ADD CONSTRAINT `Productor_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Productor` ADD CONSTRAINT `Productor_ubigeo_id_fkey` FOREIGN KEY (`ubigeo_id`) REFERENCES `ubigeo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `familiar` ADD CONSTRAINT `familiar_productor_id_fkey` FOREIGN KEY (`productor_id`) REFERENCES `Productor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos` ADD CONSTRAINT `documentos_productor_id_fkey` FOREIGN KEY (`productor_id`) REFERENCES `Productor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parcela` ADD CONSTRAINT `parcela_productores_id_fkey` FOREIGN KEY (`productores_id`) REFERENCES `Productor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parcela` ADD CONSTRAINT `parcela_ubigeo_id_fkey` FOREIGN KEY (`ubigeo_id`) REFERENCES `ubigeo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parcela_documentos` ADD CONSTRAINT `parcela_documentos_parcela_id_fkey` FOREIGN KEY (`parcela_id`) REFERENCES `parcela`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parcela_fotos` ADD CONSTRAINT `parcela_fotos_parcela_id_fkey` FOREIGN KEY (`parcela_id`) REFERENCES `parcela`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parcela_historial` ADD CONSTRAINT `parcela_historial_parcela_id_fkey` FOREIGN KEY (`parcela_id`) REFERENCES `parcela`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cultivo` ADD CONSTRAINT `cultivo_parcela_id_fkey` FOREIGN KEY (`parcela_id`) REFERENCES `parcela`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cultivo` ADD CONSTRAINT `cultivo_campania_id_fkey` FOREIGN KEY (`campania_id`) REFERENCES `campanias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `actividades` ADD CONSTRAINT `actividades_cultivo_id_fkey` FOREIGN KEY (`cultivo_id`) REFERENCES `cultivo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Insumo_has_actividades` ADD CONSTRAINT `Insumo_has_actividades_insumo_id_fkey` FOREIGN KEY (`insumo_id`) REFERENCES `Insumo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Insumo_has_actividades` ADD CONSTRAINT `Insumo_has_actividades_actividades_id_fkey` FOREIGN KEY (`actividades_id`) REFERENCES `actividades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mano_de_obra_has_actividades` ADD CONSTRAINT `Mano_de_obra_has_actividades_mano_de_obra_id_fkey` FOREIGN KEY (`mano_de_obra_id`) REFERENCES `Mano_de_obra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mano_de_obra_has_actividades` ADD CONSTRAINT `Mano_de_obra_has_actividades_actividades_id_fkey` FOREIGN KEY (`actividades_id`) REFERENCES `actividades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Maquinaria_has_actividades` ADD CONSTRAINT `Maquinaria_has_actividades_maquinaria_id_fkey` FOREIGN KEY (`maquinaria_id`) REFERENCES `Maquinaria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Maquinaria_has_actividades` ADD CONSTRAINT `Maquinaria_has_actividades_actividades_id_fkey` FOREIGN KEY (`actividades_id`) REFERENCES `actividades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `acopio_detalle` ADD CONSTRAINT `acopio_detalle_acopio_id_fkey` FOREIGN KEY (`acopio_id`) REFERENCES `acopio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `acopio_detalle` ADD CONSTRAINT `acopio_detalle_productor_id_fkey` FOREIGN KEY (`productor_id`) REFERENCES `Productor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `acopio_detalle` ADD CONSTRAINT `acopio_detalle_cultivo_id_fkey` FOREIGN KEY (`cultivo_id`) REFERENCES `cultivo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `acopio_detalle` ADD CONSTRAINT `acopio_detalle_parcela_id_fkey` FOREIGN KEY (`parcela_id`) REFERENCES `parcela`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Saco` ADD CONSTRAINT `Saco_acopio_detalle_id_fkey` FOREIGN KEY (`acopio_detalle_id`) REFERENCES `acopio_detalle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recepcion` ADD CONSTRAINT `recepcion_acopio_id_fkey` FOREIGN KEY (`acopio_id`) REFERENCES `acopio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recepcion_saco` ADD CONSTRAINT `recepcion_saco_recepcion_id_fkey` FOREIGN KEY (`recepcion_id`) REFERENCES `recepcion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inspecciones` ADD CONSTRAINT `Inspecciones_cultivo_id_fkey` FOREIGN KEY (`cultivo_id`) REFERENCES `cultivo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspeccion_checklist` ADD CONSTRAINT `inspeccion_checklist_inspeccion_id_fkey` FOREIGN KEY (`inspeccion_id`) REFERENCES `Inspecciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `No_conformidades` ADD CONSTRAINT `No_conformidades_inspeccion_id_fkey` FOREIGN KEY (`inspeccion_id`) REFERENCES `Inspecciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acciones_correctivas` ADD CONSTRAINT `Acciones_correctivas_no_conformidad_id_fkey` FOREIGN KEY (`no_conformidad_id`) REFERENCES `No_conformidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evidencia` ADD CONSTRAINT `Evidencia_inspeccion_id_fkey` FOREIGN KEY (`inspeccion_id`) REFERENCES `Inspecciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `procesamiento` ADD CONSTRAINT `procesamiento_recepcion_id_fkey` FOREIGN KEY (`recepcion_id`) REFERENCES `recepcion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kardex_movimiento` ADD CONSTRAINT `kardex_movimiento_kardex_id_fkey` FOREIGN KEY (`kardex_id`) REFERENCES `kardex`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;


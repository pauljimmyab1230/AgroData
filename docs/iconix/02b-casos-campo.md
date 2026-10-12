# Casos de Uso — Campo (ICONIX · Parte 2b)

Continuación de `02-casos-de-uso.md`. Módulo **Campo**: campañas, parcelas, cultivos y
actividades. Todos los `GET` requieren solo estar autenticado; toda escritura exige
`ADMIN` (`adminMiddleware`).

> **Regla transversal del módulo (RN-CAMPO-0):** una **campaña** actúa como *interruptor
> funcional*. Sus banderas `permitir_cultivos`, `permitir_actividades`, `permitir_cosechas`,
> `permitir_inspecciones`, `permitir_acopio` y `permitir_procesamiento` habilitan o
> restringen las operaciones asociadas a esa campaña.

---

## UC-12 · Gestionar campañas

### UC-12.1 · Listar y filtrar campañas

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Objetivo** | Ver campañas agrícolas e indicadores. |
| **Entidades** | `Campania` |
| **Pantalla** | `CampaniasScreen` |
| **Endpoints** | `GET /api/campanias`, `GET /api/campanias/stats` |

**Flujo normal**
1. El sistema carga KPIs globales (`/stats`).
2. Carga la lista (`GET /api/campanias`) con nombre, código, año agrícola, estado y fechas.
3. El usuario busca (`search`) o filtra por `estado`, `anio_agricola`, `responsable`.
4. Toca una campaña → `CampaniaDetailScreen` (UC-12.2).

**Reglas de negocio**
- **RN-1:** `limit` por defecto 20, máx. 500.

### UC-12.2 · Ver detalle de campaña

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Entidades** | `Campania`, `Cultivo`, `Actividad` |
| **Pantalla** | `CampaniaDetailScreen` |
| **Endpoints** | `GET /api/campanias/:id`, `GET /api/campanias/:id/stats`, `GET /api/campanias/:id/timeline` |

**Flujo normal**
1. El sistema obtiene la campaña y sus estadísticas.
2. Muestra ficha (responsable, técnico coordinador, objetivo, fechas, banderas de permisos).
3. Muestra línea de tiempo (`/timeline`) con hitos de la campaña.
4. Accesos a editar (UC-12.3) y eliminar (UC-12.4).

### UC-12.3 · Registrar / editar campaña

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Entidades** | `Campania` |
| **Pantalla** | `CampaniaFormScreen` |
| **Endpoints** | `POST /api/campanias` (crear), `PATCH /api/campanias/:id` (editar) |

**Flujo normal**
1. El usuario completa el formulario y pulsa **Guardar**.
2. El móvil envía `POST` (crear) o `PATCH` (editar).
3. El API valida (Joi) y persiste.

**Reglas de negocio** (de `campanias.validator.ts`)
- **RN-1:** `nombre` (≤200), `anio_agricola` con patrón **`YYYY-YYYY`**, `responsable` (≤150),
  `tecnico_coordinador` (≤150) y `objetivo` son **obligatorios** al crear.
- **RN-2:** `fecha_inicio` y `fecha_fin` obligatorias; `fecha_fin` debe ser **posterior** a `fecha_inicio`.
- **RN-3:** `estado` ∈ {PLANIFICADA, ACTIVA, FINALIZADA, CANCELADA} (por defecto PLANIFICADA).
- **RN-4:** banderas de permiso por defecto `true`; `activa` por defecto `false`; `visible` por defecto `true`.
- **RN-5 (edición):** `PATCH` exige al menos un campo (`min(1)`); si se envían ambas fechas se revalida
  que `fecha_fin > fecha_inicio`.
- **RN-6:** solo una campaña puede tener `activa = true` a la vez (campaña activa del sistema).

**Excepciones**
- **E1:** fechas inconsistentes → 400 "La fecha de fin debe ser posterior a la de inicio".
- **E2:** `USER` → 403.

### UC-12.4 · Eliminar campaña

- **Actor:** Administrador. **Pantalla:** `CampaniaDetailScreen`. **Endpoint:** `DELETE /api/campanias/:id`.
- Flujo: confirmar → eliminar → volver a la lista.

---

## UC-13 · Gestionar parcelas

### UC-13.1 · Listar y filtrar parcelas

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Objetivo** | Ver parcelas y su estado; localizarlas en mapa. |
| **Entidades** | `Parcela`, `Productor` |
| **Pantalla** | `ParcelasScreen` |
| **Endpoints** | `GET /api/parcelas`, `GET /api/parcelas/stats` |

**Flujo normal**
1. Carga KPIs (`/stats`) y la lista con nombre, código, cultivo principal, área y estado.
2. Filtra por `search`, `comunidad`, `cultivo`, `estado`, `productor_id`.
3. Toca una parcela → `ParcelaDetailScreen` (UC-13.2).

**Reglas de negocio**
- **RN-1:** `limit` por defecto 20, máx. 500; `estado` ∈ {ACTIVA, INACTIVA}.

### UC-13.2 · Ver detalle de parcela

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Entidades** | `Parcela`, `Cultivo`, `ParcelaDocumento`, `ParcelaFoto` |
| **Pantalla** | `ParcelaDetailScreen` |
| **Endpoints** | `GET /api/parcelas/:id`, `GET /api/parcelas/:id/historial`, `GET /api/parcelas/:id/documentos`, `GET /api/parcelas/:id/fotos` |

**Flujo normal**
1. Carga la ficha: datos de ubicación, suelo, agua, certificación y estado.
2. Muestra el **historial** (cultivos/actividades previos) y el polígono en el mapa.
3. Muestra documentos y fotos adjuntas.
4. Accesos a editar (UC-13.3) y eliminar (UC-13.4).

### UC-13.3 · Registrar / editar parcela (con georreferenciación)

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Entidades** | `Parcela`, `Ubigeo` |
| **Pantalla** | `ParcelaFormScreen` |
| **Endpoints** | `POST /api/parcelas` (crear), `PUT /api/parcelas/:id` (editar) |

**Flujo normal**
1. El usuario selecciona el **productor** (`productores_id`) y completa datos generales.
2. Toma la **ubicación GPS** (latitud/longitud + precisión) y/o dibuja el **polígono** de la parcela.
3. Completa datos de suelo, agua, certidumbre y fechas de levantamiento.
4. Pulsa **Guardar**; el API valida y persiste.

**Reglas de negocio** (de `parcelas.validator.ts`)
- **RN-1:** `productores_id` (entero positivo), `nombre` (≤200), `cultivo_principal` (≤100) y
  `area_total` (positivo) son obligatorios.
- **RN-2:** `latitud` ∈ [-90, 90] y `longitud` ∈ [-180, 180] (precisión 8 decimales).
- **RN-3:** el **polígono** debe tener ≥ 3 vértices; cada vértice `[lat, lng]` en rango y **sin duplicados**.
- **RN-4:** `certificacion` ∈ {ORGANICA, EN_TRANSICION, CONVENCIONAL}; `estado` ∈ {ACTIVA, INACTIVA}.
- **RN-5:** `area_unidad` por defecto `'ha'`; `area_certificada` no negativa.
- **RN-6 (edición):** `PUT` exige al menos un campo (`min(1)`).

**Excepciones**
- **E1:** polígono con <3 vértices o vértice duplicado → 400 con índice del vértice.
- **E2:** coordenadas fuera de rango → 400.

### UC-13.4 · Eliminar parcela

- **Actor:** Administrador. **Pantalla:** `ParcelaDetailScreen`. **Endpoint:** `DELETE /api/parcelas/:id`.

### UC-13.5 · Gestionar documentos y fotos de la parcela

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Entidades** | `ParcelaDocumento`, `ParcelaFoto` |
| **Endpoints** | `POST/PUT/DELETE /api/parcelas/:id/documentos[/:documentoId]`, `POST/PUT/DELETE /api/parcelas/:id/fotos[/:fotoId]`, `POST /api/upload/*` |

**Reglas de negocio**
- **RN-1 (documento):** `tipo`, `nombre_archivo`, `ruta_archivo`, `tamano_bytes`, `mime_type` obligatorios;
  `estado` ∈ {PENDIENTE, VERIFICADO, RECHAZADO}.
- **RN-2 (foto):** `titulo` (≤150) obligatorio; `descripcion` (≤500), `autor`, `fecha` y `ruta_archivo` opcionales.

> En el móvil actual estos sub-recursos se consultan en el detalle; la carga se hace vía el
> servicio de archivos. Se documenta para trazabilidad.

---

## UC-14 · Gestionar cultivos

### UC-14.1 · Listar y filtrar cultivos

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Entidades** | `Cultivo`, `Parcela`, `Campania` |
| **Pantalla** | `CultivosScreen` |
| **Endpoints** | `GET /api/cultivos`, `GET /api/cultivos/stats` |

**Flujo normal:** carga KPIs y lista (cultivo, variedad, parcela, campaña, estado); filtra por
`search`, `estado`, `campania_id`, `parcela_id`; abre detalle (UC-14.2).

**Reglas:** `limit` 20 (máx. 500); `estado` ∈ {EN_CRECIMIENTO, COSECHADO, PERDIDO}.

### UC-14.2 · Ver detalle de cultivo

- **Actor:** Usuario. **Pantalla:** `CultivoDetailScreen`. **Endpoints:** `GET /api/cultivos/:id`.
- Muestra ficha completa: siembra, sistema productivo, certificación, semilla, rendimiento y destino.

### UC-14.3 · Registrar / editar cultivo

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Entidades** | `Cultivo` |
| **Pantalla** | `CultivoFormScreen` |
| **Endpoints** | `POST /api/cultivos` (crear), `PUT /api/cultivos/:id` (editar) |

**Reglas de negocio** (de `cultivos.validator.ts`)
- **RN-1:** `campania_id` y `parcela_id` (enteros positivos) y `cultivo` (≤100) son obligatorios.
- **RN-2:** `fecha_cosecha` debe ser **posterior** a `fecha_siembra` (si ambas se envían).
- **RN-3:** `metodo_siembra` ∈ {DIRECTA, TRASPLANTE, ALMACIGO, OTRO};
  `sistema_productivo` ∈ {AGROECOLOGICO, ORGANICO, CONVENCIONAL, EN_TRANSICION};
  `tipo_agricultura` ∈ {TRADICIONAL, TECNIFICADA, MIXTA}.
- **RN-4:** `certificacion` ∈ {ORGANICA, EN_TRANSICION, SIN_CERTIFICAR} (por defecto SIN_CERTIFICAR);
  `estado` ∈ {EN_CRECIMIENTO, COSECHADO, PERDIDO} (por defecto EN_CRECIMIENTO).
- **RN-5:** `procedencia_semilla` ∈ {CERTIFICADA, COMUN, PRODUCIDA_EN_CAMPO, CONSERVADA_POR_AGRICULTOR};
  `destino_produccion` ∈ {VENTA_COOPERATIVA, COMERCIALIZACION_LOCAL, AUTOCONSUMO, SEMILLA}.
- **RN-6:** `area_sembrada` positiva; cantidades/rendimientos no negativos (precisión 2).
- **RN-7 (edición):** `PUT` exige al menos un campo (`min(1)`) y revalida el orden de fechas.

### UC-14.4 · Eliminar cultivo

- **Actor:** Administrador. **Pantalla:** `CultivoDetailScreen`. **Endpoint:** `DELETE /api/cultivos/:id`.

---

## UC-15 · Gestionar actividades

### UC-15.1 · Listar y filtrar actividades

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Entidades** | `Actividad`, `Cultivo` |
| **Pantalla** | `ActividadesScreen` |
| **Endpoints** | `GET /api/actividades`, `GET /api/actividades/stats` |

**Flujo normal:** carga lista con tipo de actividad, fecha, responsable, prioridad y estado;
filtra por `search`, `estado`, `tipo_actividad`, `cultivo_id`; abre detalle (UC-15.2).

**Reglas:** `estado` ∈ {PROGRAMADA, EN_PROCESO, COMPLETADA}; `limit` 20 (máx. 500).

### UC-15.2 · Ver detalle de actividad

- **Actor:** Usuario. **Pantalla:** `ActividadDetailScreen`. **Endpoints:** `GET /api/actividades/:id`.
- Muestra: descripción, objetivo, resultado, responsable técnico, horas, ubicación GPS,
  **insumos**, **mano de obra** y **maquinaria** (ver UC-15.3).

### UC-15.3 · Registrar / editar actividad (insumos, mano de obra y maquinaria)

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Entidades** | `Actividad`, `ActividadInsumo`, `ActividadManoObra`, `ActividadMaquinaria`, `Cultivo` |
| **Pantalla** | `ActividadFormScreen` |
| **Endpoints** | `POST /api/actividades` (crear), `PUT /api/actividades/:id` (editar) |

**Flujo normal**
1. El usuario selecciona el **cultivo** (`cultivo_id`), fecha, tipo de actividad y responsable técnico.
2. Agrega una o más filas de **insumos** (producto, cantidad, unidad, costo…).
3. Agrega una o más filas de **mano de obra** (trabajador, jornales/horas).
4. Agrega una o más filas de **maquinaria** (equipo, horas de uso, combustible).
5. Completa horas, GPS, observaciones técnicas y recomendaciones.
6. Pulsa **Guardar**; el API valida el objeto completo (incluidas las listas) y persiste.

**Reglas de negocio** (de `actividades.validator.ts`)
- **RN-1:** `cultivo_id`, `fecha`, `tipo_actividad` y `responsable_tecnico` son obligatorios al crear.
- **RN-2:** `tipo_actividad` ∈ {PREPARACION_TERRENO, SIEMBRA, RESIEMBRA, FERTILIZACION, COMPOSTAJE,
  APLICACION_BIOLES, CONTROL_BIOLOGICO, MANEJO_PLAGAS, MANEJO_ENFERMEDADES, DESHIERBIE, RIEGO, PODA,
  APORQUE, COSECHA, OTRA}.
- **RN-3:** `hora_inicio`/`hora_fin` con formato **`HH:MM`** (00:00–23:59); `prioridad` ∈ {ALTA, MEDIA, BAJA}
  (por defecto MEDIA); `estado` ∈ {PROGRAMADA, EN_PROCESO, COMPLETADA} (por defecto PROGRAMADA).
- **RN-4:** cada **insumo** exige `producto` (≤150); cada **mano de obra** exige `trabajador` (≤150);
  cada **maquinaria** exige `equipo` (≤150). Cantidades y costos no negativos.
- **RN-5 (edición):** `PUT` exige al menos un campo (`min(1)`); las listas, si se envían, reemplazan
  las existentes.

**Excepciones**
- **E1:** hora con formato incorrecto → 400 "Formato de hora inválido (HH:MM)".
- **E2:** fila de insumo/mano de obra/maquinaria sin su campo obligatorio → 400.

### UC-15.4 · Eliminar actividad

- **Actor:** Administrador. **Pantalla:** `ActividadDetailScreen`. **Endpoint:** `DELETE /api/actividades/:id`.

---

**Continúa en:** `02c-casos-calidad.md`.

# Casos de Uso — Operaciones (ICONIX · Parte 2d)

Continuación de `02-casos-de-uso.md`. Módulo **Operaciones**: acopio, recepción,
procesamiento (órdenes) y kardex. Es el módulo más complejo y el único donde el rol
`USER` puede escribir (en las órdenes de procesamiento).

> **Hallazgo de seguridad (RN-OPS-0):** a diferencia del resto del API, las rutas de
> **órdenes de procesamiento** (`POST /`, `PUT /:id`, operaciones y salidas) **no exigen
> `ADMIN`**; solo `DELETE /:id` lo hace. Igual ocurre en kardex con `POST /salidas` y
> `POST /:id/baja`. Se documenta como **inconsistencia de autorización** a corregir.

---

## UC-17 · Gestionar acopios

### UC-17.1 · Listar, buscar y filtrar acopios

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Objetivo** | Ver acopios de campo y localizar uno por su código. |
| **Entidades** | `Acopio`, `AcopioDetalle`, `Saco` |
| **Pantalla** | `AcopiosScreen` |
| **Endpoints** | `GET /api/acopios`, `GET /api/acopios/stats`, `GET /api/acopios/buscar/:codigo` |

**Flujo normal**
1. Carga KPIs (`/stats`) y la lista (código, fecha, acopiador, estado, peso neto).
2. Filtra por `search` y `estado` (`EN_CAMPO`, `EN_TRANSITO`, `RECIBIDO`).
3. **Busca por código** con `GET /api/acopios/buscar/:codigo` (badge escaneable).
4. Toca un acopio → `AcopioDetailScreen` (UC-17.2).

**Reglas de negocio**
- **RN-1:** `limit` por defecto 20, máx. 500.

### UC-17.2 · Ver detalle de acopio

- **Actor:** Usuario. **Pantalla:** `AcopioDetailScreen`. **Endpoint:** `GET /api/acopios/:id`.
- Muestra cabecera (acopiador, vehículo, ruta, pesos bruto/tara/**neto**) y el **desglose por
  productor/cultivo** con sus **sacos** (código + peso).
- Accesos a editar (UC-17.3) y eliminar (UC-17.4).

### UC-17.3 · Registrar / editar acopio

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Objetivo** | Registrar el acopio de producto en campo por productor y sacos. |
| **Precondiciones** | Existen productores y cultivos; sesión `ADMIN`. |
| **Postcondiciones** | El acopio queda registrado con sus detalles y sacos; se calcula el peso neto. |
| **Entidades** | `Acopio`, `AcopioDetalle`, `Saco`, `Productor`, `Cultivo`, `Parcela` |
| **Pantalla** | `AcopioFormScreen` |
| **Endpoints** | `POST /api/acopios` (crear), `PUT /api/acopios/:id` (editar) |

**Flujo normal**
1. El usuario ingresa fecha, **acopiador** (obligatorio), vehículo y ruta.
2. Ingresa `peso_bruto` y `tara` → el sistema calcula **peso neto** (bruto − tara).
3. Agrega uno o más **detalles**: `productor_id`, `cultivo_id`, `parcela_id` (opcional).
4. Por cada detalle cargue uno o más **sacos** (código único + peso).
5. Fija el `estado` del acopio y observaciones.
6. Pulsa **Guardar**; el API valida el árbol completo y persiste.

**Flujos alternos**
- **A1:** al asignar `estado = RECIBIDO`, el acopio queda disponible para recepción (UC-18).

**Excepciones**
- **E1:** ningún detalle → 400 "Debe agregar al menos un productor".
- **E2:** detalle sin sacos → 400 "Debe agregar al menos un saco".
- **E3:** **código de saco duplicado** (en todo el acopio) → 400 "El código del saco X está duplicado".
- **E4:** `tara > peso_bruto` → 400 "La tara no puede ser mayor al peso bruto".
- **E5:** `USER` → 403.

**Reglas de negocio** (de `acopios.validator.ts`)
- **RN-1:** `fecha` y `acopiador` (≤150) obligatorios; `codigo` (≤20) opcional (autogenerado).
- **RN-2:** `peso_bruto` y `tara` no negativos (por defecto 0, precisión 2).
- **RN-3:** cada detalle exige `productor_id` y `cultivo_id`; `parcela_id` opcional.
- **RN-4:** cada saco exige `codigo` (≤50) y `peso` positivo.
- **RN-5:** `estado` ∈ {EN_CAMPO, EN_TRANSITO, RECIBIDO} (por defecto EN_CAMPO).
- **RN-6:** unicidad global del `codigo` de saco dentro del acopio.
- **RN-7 (edición):** `PUT` con al menos un campo (`min(1)`); si vienen pesos, revalida tara ≤ bruto.

### UC-17.4 · Eliminar acopio

- **Actor:** Administrador. **Endpoint:** `DELETE /api/acopios/:id`. Confirma → elimina (con
  detalles y sacos) → vuelve a la lista.

---

## UC-18 · Gestionar recepciones

### UC-18.1 · Listar y filtrar recepciones

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Entidades** | `Recepcion` |
| **Pantalla** | `RecepcionesScreen` |
| **Endpoints** | `GET /api/recepcion`, `GET /api/recepcion/stats` |

**Flujo normal:** carga KPIs y lista (fecha, responsable, planta, estado); filtra por `search`
y `estado`; abre detalle (UC-18.2).

**Reglas:** `estado` ∈ {PENDIENTE_PESAJE, EN_CONTROL_CALIDAD, DISPONIBLE, RECHAZADA}; `limit` 20 (máx. 500).

### UC-18.2 · Ver detalle de recepción

- **Actor:** Usuario. **Pantalla:** `RecepcionDetailScreen`. **Endpoint:** `GET /api/recepcion/:id`.
- Muestra pesaje (campo/bruto/tara/neto, diferencia, merma), control de calidad
  (humedad, impurezas, materia extraña, color, olor, insectos), categoría, destino,
  resultado, firma y **sacos**.

### UC-18.3 · Registrar / editar recepción (control de calidad)

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Objetivo** | Recepcionar el producto en planta y aplicar el control de calidad. |
| **Precondiciones** | Puede originarse desde un acopio (`acopio_id`) o ser directa. Sesión `ADMIN`. |
| **Postcondiciones** | La recepción queda con pesaje, calidad, categoría y destino; firma del responsable. |
| **Entidades** | `Recepcion`, `Saco`, `Acopio` |
| **Pantalla** | `RecepcionFormScreen` |
| **Endpoints** | `POST /api/recepcion` (crear), `PUT /api/recepcion/:id` (editar) |

**Flujo normal**
1. El usuario ingresa fecha, **responsable**, **planta** y opcionalmente `acopio_id`/`lote_productor`.
2. Registra **pesaje**: `peso_campo`, `peso_bruto`, `tara` → `peso_neto` y `diferencia`.
3. Registra **calidad**: `humedad`, `impurezas`, `materia_extrana`, `merma`, color, olor, insectos.
4. Define `estado_producto`, `categoria`, `destino` y `resultado`.
5. Firma con el responsable (`documento_firmado`, `firma_responsable_url`) y añade sacos.
6. Pulsa **Guardar**; el API valida y persiste.

**Reglas de negocio** (de `recepcion.validator.ts`)
- **RN-1:** `fecha`, `responsable` y `planta` obligatorios.
- **RN-2:** `estado` ∈ {PENDIENTE_PESAJE, EN_CONTROL_CALIDAD, DISPONIBLE, RECHAZADA} (por defecto PENDIENTE_PESAJE).
- **RN-3:** `merma`, `humedad`, `impurezas`, `materia_extrana` entre **0 y 100**.
- **RN-4:** `categoria` ∈ {PRIMERA, SEGUNDA, INDUSTRIAL, DESCARTE};
  `destino` ∈ {PROCESAMIENTO, ALMACEN_TEMPORAL, RECHAZADO};
  `resultado` ∈ {ACEPTADO, ACEPTADO_CON_OBSERVACIONES, RECHAZADO};
  `estado_producto` ∈ {EXCELENTE, BUENO, REGULAR, RECHAZADO}.
- **RN-5:** `sacos_detalle` opcional; cada saco exige `codigo` y `peso` positivo.
- **RN-6 (edición):** `PUT` con al menos un campo (`min(1)`).

### UC-18.4 · Eliminar recepción

- **Actor:** Administrador. **Endpoint:** `DELETE /api/recepcion/:id`.

---

## UC-19 · Gestionar órdenes de procesamiento

> Caso de uso **núcleo** de la transformación. Una orden toma recepciones de entrada, aplica
> una secuencia de **operaciones** (según **receta**), registra **salidas pesadas** y, al
> **finalizar**, valida el **balance de masa** y da **entrada al kardex**. Puede **encadenarse**
> a la siguiente etapa (PRIMARIA → SECUNDARIA → EMPAQUE).
>
> **Este es el único caso de uso de escritura accesible a `USER`** (excepto el borrado).

### UC-19.1 · Listar y filtrar órdenes

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Entidades** | `OrdenProcesamiento` |
| **Pantalla** | `ProcesamientosScreen` |
| **Endpoints** | `GET /api/ordenes`, `GET /api/ordenes/stats` |

**Flujo normal:** lista con código, etapa, producto de salida, estado, formato; filtra por
`search`, `estado`, `etapa`, `formato_salida`, `receta_id`; abre detalle (UC-19.2).

**Reglas:** `estado` ∈ {BORRADOR, EN_PROCESO, FINALIZADO, PAUSADA, CANCELADA}; `limit` 20 (máx. **100**).

### UC-19.2 · Ver detalle y balance de la orden

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Objetivo** | Ver operaciones ejecutadas, salidas pesadas y el balance de masa. |
| **Entidades** | `OrdenProcesamiento`, `OrdenOperacion`, `OperacionEjecutada`, `SalidaPesada`, `OrdenRecepcion`, `Receta`, `OperacionProceso` |
| **Pantalla** | `ProcesamientoDetailScreen` |
| **Endpoints** | `GET /api/ordenes/:id`, `GET /api/ordenes/:id/balance`, `GET /api/ordenes/:id/trazabilidad` |

**Flujo normal**
1. Carga la orden (planta, responsable, etapa, receta, producto de salida, pesos).
2. Muestra las **operaciones ejecutadas** (peso antes/después, humedad, operario, resultado).
3. Muestra las **salidas pesadas** (tipo, cantidad, unidad, destino).
4. Muestra el **balance** (`/balance`) y la **trazabilidad** (`/trazabilidad`) del producto.

### UC-19.3 · Registrar orden de procesamiento

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario (o Administrador) |
| **Objetivo** | Crear la orden que procesará las recepciones de entrada. |
| **Precondiciones** | Existen recepciones y (opcionalmente) una receta. |
| **Postcondiciones** | Orden creada con sus operaciones y recepciones asignadas. |
| **Entidades** | `OrdenProcesamiento`, `OrdenOperacion`, `OrdenRecepcion`, `Receta`, `OperacionProceso`, `Recepcion` |
| **Pantalla** | `ProcesamientoFormScreen` (por cablear) |
| **Endpoints** | `POST /api/ordenes` |

**Flujo normal**
1. El usuario ingresa `planta`, `responsable`, `fecha_inicio`, `etapa`, `producto_salida`.
2. Selecciona (opcional) una **receta** que precarga las operaciones de la orden.
3. Añade/confirma las **operaciones** de la secuencia (`operacion_id`, `orden`).
4. Asigna **recepciones** de entrada con su `cantidad_asignada` (y opcional `orden_origen_id`).
5. Pulsa **Guardar**; la orden nace con `estado = BORRADOR`.

**Reglas de negocio** (de `ordenes.validator.ts`)
- **RN-1:** `planta`, `responsable`, `fecha_inicio`, `etapa` y `producto_salida` obligatorios.
- **RN-2:** `etapa` ∈ {PRIMARIA, SECUNDARIA, EMPAQUE}.
- **RN-3:** `formato_salida` ∈ {GRANO, HARINA, HOJUELA, POP, GRANEL, OTRO} (por defecto GRANO).
- **RN-4:** `calidad` ∈ {PRIMERA, SEGUNDA, TERCERA, DESCARTE}; `humedad_final` entre 0 y 100.
- **RN-5:** cada recepción asignada exige `recepcion_id` y `cantidad_asignada` positiva.

### UC-19.4 · Registrar operación ejecutada

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario (o Administrador) |
| **Entidades** | `OperacionEjecutada`, `OperacionProceso` |
| **Endpoints** | `POST /api/ordenes/:id/operaciones`, `PUT .../:operacionOrdenId`, `DELETE .../:operacionOrdenId` |

**Flujo normal:** registra la ejecución de una operación (peso antes/después, humedad, operario,
resultado) y marca `completada`. Puede editarse o eliminarse de la orden.

**Reglas:** `operacion_id` obligatorio; pesos no negativos; `humedad` entre 0 y 100.

### UC-19.5 · Registrar salida pesada

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario (o Administrador) |
| **Entidades** | `SalidaPesada` |
| **Endpoints** | `POST /api/ordenes/:id/salidas`, `PUT .../:salidaId`, `DELETE .../:salidaId` |

**Reglas de negocio**
- **RN-1:** `tipo_salida` ∈ {PRODUCTO_BUENO, MERMA, PIEDRAS, SAPONINA, ENVASE, OTRO};
  `descripcion` y `cantidad` (positiva) obligatorios.
- **RN-2:** `unidad` ∈ {KG, UNIDAD, LT} (por defecto KG).
- **RN-3:** `destino` ∈ {KARDEX, DESCARTE, REPROCESO, SUBPRODUCTO, VENTA_DIRECTA} (por defecto SUBPRODUCTO).
- **RN-4:** `cuenta_en_balance` indica si la salida participa del balance de masa.

### UC-19.6 · Finalizar orden (balance + kardex)

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario (o Administrador) |
| **Objetivo** | Cerrar la orden, validar el balance de masa y registrar el producto en kardex. |
| **Precondiciones** | La orden tiene operaciones y salidas registradas. |
| **Postcondiciones** | Orden en `FINALIZADO` y **entrada de producto bueno en el Kardex**. |
| **Endpoints** | `POST /api/ordenes/:id/finalizar` |

**Flujo normal**
1. El usuario pulsa **Finalizar**.
2. El sistema obtiene el balance (`/balance`) y valida que la masa cuadre.
3. Al ser válido, cambia el estado a `FINALIZADO` y **crea el movimiento/ítem en Kardex** (UC-20).
4. Devuelve el resumen final.

**Excepciones**
- **E1:** balance inconsistente → 400/409 con el detalle del descuadre.

### UC-19.7 · Encadenar etapa

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario (o Administrador) |
| **Objetivo** | Generar la orden de la siguiente etapa a partir de la actual. |
| **Endpoints** | `POST /api/ordenes/:id/encadenar` |

**Flujo normal:** partiendo de una orden finalizada, crea una nueva orden (`orden_origen_id`)
en la etapa siguiente (PRIMARIA → SECUNDARIA → EMPAQUE), heredando información.

### UC-19.8 · Eliminar orden

- **Actor:** **Administrador** (única operación de la orden con `adminMiddleware`).
- **Endpoint:** `DELETE /api/ordenes/:id`.

---

## UC-20 · Gestionar kardex (inventario)

### UC-20.1 · Listar inventario, alertas y movimientos

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Objetivo** | Consultar existencias, alertas de stock y movimientos. |
| **Entidades** | `KardexItem`, `KardexMovimiento` |
| **Pantalla** | `KardexScreen` |
| **Endpoints** | `GET /api/kardex`, `GET /api/kardex/inventario`, `GET /api/kardex/alertas`, `GET /api/kardex/movimientos`, `GET /api/kardex/stats` |

**Flujo normal**
1. Carga KPIs (`/stats`) y el inventario con producto, cantidad, unidad y estado.
2. Consulta **alertas** (stock mínimo/máximo y vencimientos).
3. Consulta **movimientos globales**.
4. Filtra por `search`, `estado`, `categoria`; abre detalle (UC-20.2).

**Reglas:** `estado` ∈ {DISPONIBLE, RESERVADO, CONSUMIDO, VENCIDO}; `limit` 20 (máx. 500).

### UC-20.2 · Ver detalle de ítem de kardex

- **Actor:** Usuario. **Pantalla:** `KardexDetailScreen`.
- **Endpoints:** `GET /api/kardex/:id`, `GET /api/kardex/:id/movimientos`.
- Muestra ficha (producto, categoría, stock actual/mín/máx, ubicación, vencimiento) y el historial de movimientos.

### UC-20.3 · Registrar / editar ítem de kardex

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Entidades** | `KardexItem` |
| **Pantalla** | `KardexFormScreen` |
| **Endpoints** | `POST /api/kardex` (crear), `PUT /api/kardex/:id` (editar) |

**Reglas de negocio** (de `kardex.validator.ts`)
- **RN-1:** `producto` (≤200) y `categoria` (≤100) obligatorios; `fecha_ingreso` obligatoria.
- **RN-2:** `unidad` por defecto `'kg'`; `cantidad_actual` por defecto 0 (no negativa).
- **RN-3:** `estado` ∈ {DISPONIBLE, RESERVADO, CONSUMIDO, VENCIDO} (por defecto DISPONIBLE).
- **RN-4 (edición):** `PUT` con al menos un campo (`min(1)`); `cantidad_actual` **no** se edita
  directamente (se modifica por movimientos/recompute).

### UC-20.4 · Registrar movimiento de kardex

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Endpoints** | `POST /api/kardex/:id/movimientos`, `DELETE /api/kardex/:id/movimientos/:movimientoId` |

**Reglas de negocio**
- **RN-1:** `tipo` ∈ {ENTRADA, SALIDA, TRANSFERENCIA, AJUSTE}; `cantidad` positiva obligatoria.
- **RN-2:** si `tipo = TRANSFERENCIA`, `destino` es **obligatorio**.
- **RN-3:** el movimiento recalcula el stock del ítem.

### UC-20.5 · Registrar salida global de kardex ⚠️ sin `ADMIN`

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario (o Administrador) |
| **Endpoints** | `POST /api/kardex/salidas` |
| **Hallazgo** | **No exige `adminMiddleware`** (ver RN-OPS-0). |

**Flujo normal:** registra una salida de producto del inventario (consumo/despacho).

### UC-20.6 · Recalcular stock y dar de baja

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador (`recompute`) / Usuario (`baja`) |
| **Endpoints** | `POST /api/kardex/:id/recompute` (ADMIN), `POST /api/kardex/:id/baja` (⚠️ sin ADMIN) |

**Flujo normal**
1. **Recompute:** recalcula `cantidad_actual` a partir de los movimientos (fuente de verdad).
2. **Baja:** marca el ítem como dado de baja (movimiento de ajuste/salida).

### UC-20.7 · Eliminar ítem de kardex

- **Actor:** Administrador. **Endpoint:** `DELETE /api/kardex/:id`.

---

## Anexo — Catálogos de proceso (soporte a UC-19)

### UC-19-A1 · Gestionar operaciones de proceso

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador (escritura); Usuario (lectura) |
| **Entidades** | `OperacionProceso` |
| **Endpoints** | `GET /api/operaciones`, `GET /api/operaciones/activas`, `GET /api/operaciones/:id`, `POST/PUT/DELETE /api/operaciones[/:id]` |

**Reglas** (de `createOperacionSchema`): `codigo` (2–20) y `nombre` (2–100) obligatorios; `orden` ≥ 0; `activo` por defecto true.

### UC-19-A2 · Gestionar recetas

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador (escritura); Usuario (lectura) |
| **Entidades** | `Receta`, `RecetaOperacion`, `OperacionProceso` |
| **Endpoints** | `GET /api/recetas`, `GET /api/recetas/activas`, `GET /api/recetas/:id`, `POST/PUT/DELETE /api/recetas[/:id]` |

**Reglas** (de `createRecetaSchema`): `codigo` (2–20), `nombre` (2–150), `producto_base` (2–100) y `etapa` obligatorios;
`etapa` ∈ {PRIMARIA, SECUNDARIA, EMPAQUE}; `formato_salida` ∈ {GRANO, HARINA, HOJUELA, POP, GRANEL, OTRO};
`operaciones[]` = lista de `{ operacion_id, orden?, requerida?, parametros_default? }`.

> **Legado:** existe además el recurso `procesamiento` (`/api/procesamiento`) con su propio
> modelo (`Procesamiento`, `ProcesamientoLote`, `ProcesamientoOperacion`). Está **excluido del
> dominio vigente** (ver Parte 1) y se conserva solo por compatibilidad. No forma parte del
> alcance móvil.

---

**Continúa en:** `02e-casos-administracion.md`.

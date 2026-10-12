# Casos de Uso — Calidad (ICONIX · Parte 2c)

Continuación de `02-casos-de-uso.md`. Módulo **Calidad**: inspecciones del Sistema Interno
de Control (SIC). Escritura exclusiva de `ADMIN`; lectura para cualquier usuario autenticado.

---

## UC-16 · Gestionar inspecciones

### UC-16.1 · Listar y filtrar inspecciones

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Objetivo** | Consultar inspecciones y sus indicadores de cumplimiento. |
| **Entidades** | `Inspeccion`, `Cultivo` |
| **Pantalla** | `InspeccionesScreen` |
| **Endpoints** | `GET /api/inspecciones`, `GET /api/inspecciones/stats` |

**Flujo normal**
1. El sistema carga KPIs (`/stats`: total, aprobadas, no conformes, pendientes…).
2. Carga la lista con código, fecha, inspector, estado y resultado.
3. El usuario busca (`search`) o filtra por `estado` y `cultivo_id`.
4. Toca una inspección → `InspeccionDetailScreen` (UC-16.2).

**Reglas de negocio**
- **RN-1:** `limit` por defecto 20, máx. 500.
- **RN-2:** `estado` ∈ {PENDIENTE, APROBADA, NO_CONFORME}.

### UC-16.2 · Ver detalle de inspección

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Objetivo** | Revisar el resultado completo: checklist, no conformidades y evidencias. |
| **Entidades** | `Inspeccion`, `InspeccionChecklistItem`, `NoConformidad`, `AccionCorrectiva`, `Evidencia` |
| **Pantalla** | `InspeccionDetailScreen` |
| **Endpoints** | `GET /api/inspecciones/:id` |

**Flujo normal**
1. El sistema obtiene la inspección por id.
2. Muestra: ficha general (inspector, fecha, ubicación GPS, riesgo general, resumen ejecutivo).
3. Muestra el **checklist** (criterio → cumplimiento, riesgo, observación, evidencia).
4. Muestra las **no conformidades** con su severidad, estado y **acciones correctivas**.
5. Muestra las **evidencias** (archivos/fotos).
6. Accesos a editar (UC-16.3) y eliminar (UC-16.4).

### UC-16.3 · Registrar / editar inspección

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Objetivo** | Levantar el acta de inspección del SIC sobre un cultivo. |
| **Precondiciones** | Existe un `cultivo` asociado; sesión `ADMIN`. |
| **Postcondiciones** | La inspección queda registrada con su checklist, no conformidades y evidencias. |
| **Entidades** | `Inspeccion`, `InspeccionChecklistItem`, `NoConformidad`, `AccionCorrectiva`, `Evidencia`, `Cultivo` |
| **Pantalla** | `InspeccionFormScreen` |
| **Endpoints** | `POST /api/inspecciones` (crear), `PUT /api/inspecciones/:id` (editar) |

**Flujo normal**
1. El usuario selecciona el **cultivo** (`cultivo_id`), fecha e inspector.
2. Captura la **ubicación GPS** (latitud/longitud/altitud/precisión).
3. Completa el **checklist**: por cada criterio marca `cumplimiento` (CUMPLE/NO_CUMPLE/NO_APLICA),
   `riesgo` (BAJO/MEDIO/ALTO) y observación/evidencia.
4. Registra **no conformidades**: tipo, categoría, descripción, severidad, responsable, fechas y
   las **acciones correctivas** asociadas.
5. Añade **evidencias** (nombre, tipo, ruta del archivo).
6. Define el **resultado**, `riesgo_general`, resumen ejecutivo y próxima inspección.
7. Pulsa **Guardar**; el API valida el objeto completo (incluidas las listas) y persiste.

**Flujos alternos**
- **A1 (borrador):** se guarda con `estado = PENDIENTE` sin `resultado`.

**Excepciones**
- **E1:** falta `cultivo_id`, `fecha` o `inspector` → 400.
- **E2:** valores fuera de los enums permitidos → 400.
- **E3:** `USER` → 403.

**Reglas de negocio** (de `inspecciones.validator.ts`)
- **RN-1:** `cultivo_id`, `fecha` e `inspector` (≤150) son **obligatorios**.
- **RN-2:** `estado` ∈ {PENDIENTE, APROBADA, NO_CONFORME} (por defecto PENDIENTE).
- **RN-3:** `resultado` ∈ {CONFORME, CONFORME_CON_OBSERVACIONES, NO_CONFORME}.
- **RN-4:** cada ítem del **checklist** exige `criterio` (≤200); `cumplimiento` ∈ {CUMPLE, NO_CUMPLE, NO_APLICA};
  `riesgo` ∈ {BAJO, MEDIO, ALTO} (por defecto BAJO).
- **RN-5:** cada **no conformidad** exige `tipo`, `categoria`, `descripcion` y `responsable`;
  `severidad` ∈ {LEVE, MODERADA, CRITICA} (por defecto LEVE);
  `estado` ∈ {PENDIENTE, EN_PROCESO, CORREGIDA, VERIFICADA}.
- **RN-6:** cada **acción correctiva** exige `accion` y `responsable`;
  `estado` ∈ {PENDIENTE, EN_PROCESO, COMPLETADA, VERIFICADA}.
- **RN-7:** `riesgo_general` ∈ {BAJO, MEDIO, ALTO} (por defecto BAJO).
- **RN-8 (edición):** `PUT` exige al menos un campo (`min(1)`); las listas enviadas reemplazan las existentes.

### UC-16.4 · Eliminar inspección

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Pantalla** | `InspeccionDetailScreen` |
| **Endpoint** | `DELETE /api/inspecciones/:id` |

**Flujo normal:** confirmar → eliminar (junto con checklist, no conformidades y evidencias) → volver a la lista.

---

**Continúa en:** `02d-casos-operaciones.md`.

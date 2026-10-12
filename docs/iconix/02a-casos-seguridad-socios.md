# Casos de Uso — Seguridad y Socios (ICONIX · Parte 2a)

Continuación de `02-casos-de-uso.md`. Contiene el detalle de los casos de uso de
**Seguridad** (autenticación) y **Socios** (productores y familiares).

---

# MÓDULO: SEGURIDAD

## UC-01 · Iniciar sesión

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Disparador** | El usuario abre la app sin sesión activa (o la sesión expiró). |
| **Objetivo** | Obtener un par de tokens (acceso + refresco) que habiliten el uso de la app. |
| **Precondiciones** | Existe una cuenta de usuario `activo` con credenciales válidas. |
| **Postcondiciones** | Token de acceso en memoria, refresh token en `SecureStore`, datos del usuario en `AsyncStorage`; se muestra el `AppNavigator`. |
| **Entidades** | `Usuario`, `TokenRefresco` |
| **Pantalla** | `LoginScreen` |
| **Endpoints** | `POST /api/auth/login` |

**Flujo normal**
1. El usuario abre la app. `App.tsx` consulta `getStoredAuth()`; no hay sesión → muestra `LoginScreen`.
2. El usuario ingresa **correo** y **contraseña**.
3. El usuario pulsa **Iniciar Sesión**.
4. El sistema valida el formato localmente y envía `POST /api/auth/login`.
5. El API valida (Joi), verifica credenciales (`bcrypt`), valida que la cuenta esté activa y emite `token` (JWT) + `refreshToken`.
6. El móvil guarda el **access token en memoria** (`setToken`), el **refresh token en `SecureStore`** (cifrado por el SO) y el **usuario en `AsyncStorage`**.
7. `onLoginSuccess` cambia el estado a `isLoggedIn = true` y se monta `AppNavigator` (dashboard).

**Flujos alternos**
- **A1 (sesión persistida):** al abrir la app existe `AsyncStorage` con usuario → se monta `AppNavigator` directamente sin pasar por login (no valida el token en ese momento).

**Excepciones**
- **E1:** credenciales inválidas → API responde 401; el móvil muestra el mensaje de error y permanece en `LoginScreen`.
- **E2:** demasiados intentos → API responde 429 (límite **10 intentos / 15 min**).
- **E3:** sin conexión → error de red; se muestra mensaje y se permite reintentar.

**Reglas de negocio**
- **RN-1:** `email` debe tener formato de correo; `password` no vacío.
- **RN-2:** cuenta con `activo = false` no puede iniciar sesión.
- **RN-3:** el access token es JWT firmado `HS256`, `issuer=agrodata-api`; expira (por defecto 7 días).

**Frecuencia:** alta.

---

## UC-02 · Renovar sesión (automático)

| Campo | Detalle |
|---|---|
| **Actor primario** | Sistema (transparente al usuario) |
| **Disparador** | El API responde **401** a una petición autenticada. |
| **Objetivo** | Renovar el access token sin pedir credenciales de nuevo. |
| **Precondiciones** | Existe un refresh token válido en `SecureStore`. |
| **Postcondiciones** | Nuevo access token en memoria y nuevo refresh token rotado en `SecureStore`. |
| **Entidades** | `Usuario`, `TokenRefresco` |
| **Infraestructura** | Interceptor de respuesta en `services/api.ts` |
| **Endpoints** | `POST /api/auth/refresh` |

**Flujo normal**
1. Una petición falla con 401 (distinta de `/auth/login` o `/auth/refresh`).
2. El interceptor ejecuta `intentarRefresh()` (una sola vez a la vez; reutiliza la promesa en curso).
3. Se llama `POST /api/auth/refresh` con el refresh token.
4. El API valida el token, **revoca el anterior** y emite un par nuevo (rotación).
5. El móvil guarda los nuevos tokens y **reintenta la petición original** (`_reintentoRefresh = true`).

**Flujos alternos**
- **A1:** el refresh ya se intentó para esa petición (`_reintentoRefresh`) → no se reintenta en bucle; se propaga el 401.

**Excepciones**
- **E1:** refresh inválido/expirado → `setToken(null)` + evento `LOGOUT`; `App.tsx` vuelve a `LoginScreen`.

**Reglas de negocio**
- **RN-1 (rotación):** cada uso del refresh token lo invalida y lo reemplaza (`replaced_by`). Reutilizar un token revocado invalida la sesión.
- **RN-2:** las rutas `/auth/login` y `/auth/refresh` quedan **excluidas** del auto-refresh.

**Frecuencia:** media (según expiración del access token).

---

## UC-03 · Cerrar sesión

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Disparador** | El usuario pulsa salir (icono en el encabezado `HeaderUsuario`). |
| **Objetivo** | Terminar la sesión y revocar el refresh token del servidor. |
| **Precondiciones** | Sesión activa. |
| **Postcondiciones** | Tokens borrados localmente; `isLoggedIn = false`; se muestra `LoginScreen`. |
| **Entidades** | `TokenRefresco` |
| **Endpoints** | `POST /api/auth/logout` |

**Flujo normal**
1. El usuario pulsa **Cerrar sesión** (hook `useLogout`).
2. El móvil lee el refresh token de `SecureStore` y llama `POST /api/auth/logout` con él.
3. El API revoca el refresh token del servidor.
4. El móvil limpia memoria + `SecureStore` + `AsyncStorage` y emite `LOGOUT`.
5. `App.tsx` reacciona al evento y muestra `LoginScreen`.

**Flujos alternos**
- **A1:** el servidor falla → el cierre local se realiza igualmente (logout "best-effort").

**Reglas de negocio**
- **RN-1:** el logout local nunca debe bloquearse por un error de red.

**Frecuencia:** media.

---

## UC-04 · Ver perfil del usuario

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Objetivo** | Consultar los datos del usuario autenticado. |
| **Precondiciones** | Sesión activa con token válido. |
| **Postcondiciones** | Se muestran `nombre`, `email`, `rol`. |
| **Entidades** | `Usuario` |
| **Endpoints** | `GET /api/auth/profile` |

**Flujo normal**
1. El sistema (o el usuario al abrir su perfil) solicita `GET /api/auth/profile`.
2. El API devuelve los datos del usuario del token.
3. Se muestran en pantalla.

**Excepciones**
- **E1:** token expirado → dispara UC-02; si falla, E1 de UC-02.

**Frecuencia:** baja.

---

## UC-05 · Cambiar contraseña

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Objetivo** | Reemplazar la contraseña actual por una nueva. |
| **Precondiciones** | Sesión activa. |
| **Postcondiciones** | La contraseña queda actualizada; el usuario sigue autenticado. |
| **Entidades** | `Usuario` |
| **Endpoints** | `PATCH /api/auth/change-password` |

**Flujo normal**
1. El usuario ingresa **contraseña actual** y **contraseña nueva**.
2. El sistema envía `PATCH /api/auth/change-password`.
3. El API verifica la contraseña actual, valida la nueva y la guarda (hash `bcrypt`).
4. Se confirma el cambio.

**Excepciones**
- **E1:** contraseña actual incorrecta → 401/400 con mensaje.
- **E2:** la nueva no cumple complejidad → error de validación.

**Reglas de negocio**
- **RN-1:** la nueva contraseña debe tener ≥ 8 caracteres y contener **mayúscula, minúscula y número**.
- **RN-2:** no puede exceder 128 caracteres.

**Frecuencia:** baja.

---

# MÓDULO: SOCIOS

> **Patrón común de los CRUD de este módulo:** pantalla de **lista** (búsqueda + filtros +
> paginación) → pantalla de **detalle** (lectura) → pantalla de **formulario** (crear/editar,
> con botón de eliminar en modo edición). Las listas usan `limit` por defecto 20 (máx. 500).

## UC-06 · Listar y buscar productores

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Objetivo** | Localizar productores y ver indicadores rápidos. |
| **Precondiciones** | Sesión activa. |
| **Postcondiciones** | Lista paginada de productores + KPIs. |
| **Entidades** | `Productor`, `Familiar` |
| **Pantalla** | `ProductoresScreen` |
| **Endpoints** | `GET /api/productores`, `GET /api/productores/stats`, `GET /api/productores/comunidades` |

**Flujo normal**
1. El sistema carga los KPIs (`/stats`: total, activos, suspendidos, mujeres, varones).
2. El sistema carga la lista (`GET /api/productores`) con avatar, nombre, código, comunidad y estado.
3. El usuario puede **buscar** (`search`) y **filtrar** por `estado`, `cargo`, `sexo`, `comunidad`.
4. El usuario toca un productor → navega a `ProductorDetailScreen` (UC-07).

**Reglas de negocio**
- **RN-1:** `limit` por defecto 20, máximo 500; `page ≥ 1`.
- **RN-2:** los filtros son combinables; `comunidad` se sugiere desde `/comunidades`.

**Frecuencia:** alta.

---

## UC-07 · Ver detalle de productor

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Objetivo** | Consultar toda la ficha del productor y acceder a sus familiares. |
| **Precondiciones** | El productor existe. |
| **Entidades** | `Productor`, `Familiar` |
| **Pantallas** | `ProductorDetailScreen` |
| **Endpoints** | `GET /api/productores/:id`, `GET /api/productores/:id/familiares` |

**Flujo normal**
1. El sistema solicita `GET /api/productores/:id`.
2. Muestra secciones: **Datos personales**, **Contacto**, **Ubicación**, **Info adicional**.
3. Botón **Ver familiares** → navega a `FamiliaresScreen` (UC-11.1).
4. Botón **Editar** → navega a `ProductorEditScreen` (UC-09).

**Excepciones**
- **E1:** id inexistente → 404.

**Frecuencia:** alta.

---

## UC-08 · Registrar productor

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Objetivo** | Dar de alta un nuevo productor (socio). |
| **Precondiciones** | Sesión `ADMIN`. |
| **Postcondiciones** | El productor queda registrado con `estado = ACTIVO` y `fecha_ingreso`. |
| **Entidades** | `Productor` |
| **Pantalla** | `ProductorCreateScreen` |
| **Endpoints** | `POST /api/productores` |

**Flujo normal**
1. El usuario abre el formulario (botón **+ Nuevo**).
2. Completa secciones: datos personales, contacto, ubicación, info adicional.
3. Pulsa **Guardar**; el móvil transforma a `snake_case` (`toBackend`) y envía `POST`.
4. El API valida (Joi), verifica unicidad de `dni` y guarda.
5. El sistema vuelve a la lista y la refresca.

**Flujos alternos**
- **A1:** el `codigo` puede ser autogenerado por el backend si no se envía.

**Excepciones**
- **E1:** DNI duplicado → 409 con mensaje.
- **E2:** faltan campos obligatorios → 400 con detalle de validación.
- **E3:** usuario `USER` → 403 "Acceso denegado. Se requiere rol de administrador".

**Reglas de negocio** (de `productores.validator.ts`)
- **RN-1:** `dni` exactamente **8 dígitos**.
- **RN-2:** `nombres`, `apellido_paterno`, `apellido_materno` ≥ 2 y ≤ 100 caracteres.
- **RN-3:** `sexo` ∈ {MASCULINO, FEMENINO}; `estado_civil` ∈ {SOLTERO, CASADO, CONVIVIENTE, VIUDO}.
- **RN-4:** `nivel_educativo` ∈ {SIN_ESTUDIOS, PRIMARIA, SECUNDARIA, TECNICO, UNIVERSITARIO}.
- **RN-5:** `idioma_principal` ∈ {QUECHUA, ESPANOL, OTRO} (no NINGUNO); `idioma_secundario` admite NINGUNO.
- **RN-6:** `cargo` ∈ {SOCIO, DIRECTIVO, PRESIDENTE, VICEPRESIDENTE, SECRETARIO, TESORERO, VOCAL, OTRO}.
- **RN-7:** `telefono` (7–20) opcional con formato; `correo` formato email.
- **RN-8:** `departamento`, `provincia`, `distrito`, `comunidad` obligatorios.
- **RN-9:** `estado` ∈ {ACTIVO, INACTIVO, SUSPENDIDO} (por defecto ACTIVO).

**Frecuencia:** media.

---

## UC-09 · Editar productor

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Objetivo** | Actualizar la información de un productor. |
| **Precondiciones** | Productor existente; sesión `ADMIN`. |
| **Entidades** | `Productor` |
| **Pantalla** | `ProductorEditScreen` |
| **Endpoints** | `PUT /api/productores/:id` |

**Flujo normal**
1. El sistema precarga los datos (`GET /api/productores/:id`).
2. El usuario modifica campos y pulsa **Guardar**.
3. El móvil envía solo los campos presentes (`toBackend`) vía `PUT`.
4. El API valida y guarda.

**Excepciones**
- **E1:** `PUT` sin campos → validación `min(1)` falla (400).
- **E2:** `USER` → 403.

**Reglas de negocio:** las mismas de UC-08 (RN-1…RN-9) en modo parcial.

**Frecuencia:** media.

---

## UC-10 · Eliminar productor

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Objetivo** | Dar de baja un productor. |
| **Precondiciones** | Productor existente; sesión `ADMIN`. |
| **Postcondiciones** | El productor se elimina (borrado lógico mediante `activo`). |
| **Entidades** | `Productor` |
| **Pantalla** | `ProductorEditScreen` (botón "Eliminar") |
| **Endpoints** | `DELETE /api/productores/:id` |

**Flujo normal**
1. En edición, el usuario pulsa **Eliminar productor**.
2. Se muestra confirmación.
3. El móvil envía `DELETE`.
4. El API marca/elimina y responde; el sistema vuelve a la lista.

**Reglas de negocio**
- **RN-1:** soft delete (`activo = false`); los registros relacionados se conservan.

**Frecuencia:** baja.

---

## UC-11 · Gestionar familiares

El módulo agrupa el CRUD de familiares de un productor.

### UC-11.1 · Listar familiares

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Entidades** | `Familiar` |
| **Pantalla** | `FamiliaresScreen` |
| **Endpoints** | `GET /api/productores/:id/familiares` |

**Flujo normal:** el sistema carga la lista; muestra nombre, parentesco y badges
(`dependiente`, `vive_con_productor`); permite tocar para editar o tocar el ícono de
papelera para eliminar.

### UC-11.2 · Registrar familiar

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Entidades** | `Familiar` |
| **Pantalla** | `FamiliarCreateScreen` |
| **Endpoints** | `POST /api/productores/:id/familiares` |

**Flujo normal:** el usuario completa datos y condición (switches) y guarda.

**Reglas de negocio** (de `createFamiliarSchema`)
- **RN-1:** `nombres` (2–200) y `parentesco` (≤50) obligatorios.
- **RN-2:** `dni` opcional, si viene debe tener 8 dígitos.
- **RN-3:** `sexo` obligatorio; `fecha_nacimiento` obligatoria.
- **RN-4:** `dependiente` (falso) y `vive_con_productor` (verdadero) por defecto.

### UC-11.3 · Editar familiar

- **Actor:** Administrador. **Pantalla:** `FamiliarEditScreen`. **Endpoint:** `PUT /api/productores/:id/familiares/:familiarId`.
- Flujo: precarga, modifica, guarda (validación parcial `min(1)`).

### UC-11.4 · Eliminar familiar

- **Actor:** Administrador. **Endpoint:** `DELETE /api/productores/:id/familiares/:familiarId`.
- Flujo: confirmar y eliminar; volver a la lista.

---

## UC-11b · Gestionar documentos de productor (opcional en móvil)

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Entidades** | `DocumentoProductor` |
| **Endpoints** | `GET/POST /api/productores/:id/documentos`, `PUT …/:documentoId/estado`, `DELETE …/:documentoId`, `POST …/documentos/cleanup` |
| **Servicio de archivos** | `POST /api/upload/documentos` |

**Reglas de negocio** (de `createDocumentoSchema`)
- **RN-1:** `tamano_bytes` ≤ **10 MB**.
- **RN-2:** `mime_type` ∈ {image/jpeg, image/png, application/pdf, image/webp}.
- **RN-3:** `estado` ∈ {PENDIENTE, VERIFICADO, RECHAZADO}.

> En el móvil actual este flujo no está expuesto como pantalla dedicada; el API sí lo
> ofrece. Se documenta para completitud.

---

**Continúa en:** `02b-casos-campo.md`.

# Análisis de Robustez — Gestión de Órdenes de Procesamiento (ICONIX · Parte 3)

> **Misma convención:** 🟦 Frontera · 🟩 Control · 🟧 Entidad · 🟪 Actor secundario.
>
> **Corrección de rutas (verificada en `apps/api/src/app.ts`):** el módulo se monta en
> `/api/ordenes-procesamiento`, `/api/operaciones-proceso` y `/api/recetas`
> (no `/api/ordenes`, `/api/operaciones`, `/api/recepcion`). Los documentos previos
> (`02d`, diagramas) usaban las rutas cortas; este archivo las da **correctas**.

**Caso de uso cubierto:** UC-19 *Gestionar órdenes de procesamiento* (19.1 listado,
19.2 detalle + balance + trazabilidad, 19.3 alta, 19.4 operación ejecutada,
19.5 salida pesada, 19.6 finalizar, 19.7 encadenar, 19.8 baja).

---

## 1. Diagrama de robustez

```mermaid
flowchart TB
    %% ─────────── ACTORES ───────────
    Act(["👤 Usuario / Administrador<br/>(escritura libre salvo baja)"])

    %% ─────────── FRONTERA ───────────
    subgraph FRONTERA["Frontera (pantallas del móvil)"]
        B1["ProcesamientosScreen<br/>(lista + filtros)"]
        B2["ProcesamientoFormScreen<br/>(alta / edición)"]
        B3["ProcesamientoDetailScreen<br/>(detalle, balance, trazabilidad)"]
        B4["Sección Operaciones<br/>(ejecutadas)"]
        B5["Sección Salidas<br/>(pesadas)"]
    end

    %% ─────────── CONTROL ───────────
    subgraph CONTROL["Control (coordinación)"]
        C1{{"OrdenesController<br/>(getAll / getById / getBalance<br/>getTrazabilidad / getStats)"}}
        C2{{"OrdenesController<br/>(create / update / remove)<br/>⚠️ solo remove exige ADMIN"}}
        C3{{"ValidarOrden<br/>(Joi: create/updateOrdenSchema)"}}
        C4{{"Autenticar ADMIN<br/>(solo DELETE /:id)"}}
        C5{{"Envios a Opciones<br/>(recetas, operaciones, recepciones)"}}
        C6{{"OrdenesController<br/>(addOperacion / updateOperacion<br/>removeOperacion)"}}
        C7{{"ValidarOperacionEjecutada<br/>(Joi)"}}
        C8{{"OrdenesController<br/>(addSalida / updateSalida<br/>removeSalida)"}}
        C9{{"ValidarSalida<br/>(Joi)"}}
        C10{{"ValidarBalance<br/>(balance de masa)"}}
        C11{{"RegistrarEnKardex<br/>(al finalizar)"}}
        C12{{"OrdenesController<br/>(finalizar / encadenar)"}}
    end

    %% ─────────── ENTIDAD ───────────
    subgraph ENTIDAD["Entidad (dominio persistente)"]
        E1[("OrdenProcesamiento")]
        E2[("OrdenOperacion")]
        E3[("OperacionEjecutada")]
        E4[("SalidaPesada")]
        E5[("OrdenRecepcion")]
        E6[("Receta")]
        E7[("OperacionProceso")]
        E8[("Recepcion")]
    end

    %% ─────────── FLUJO ───────────
    Act --> B1
    B1 --> C1
    C1 --> E1
    E1 -. "sigue" .-> E6
    E6 -. "compuesta por" .-> E7
    E1 -. "recibe" .-> E8

    B1 --> B2
    B2 --> C5
    C5 --> E6
    C5 --> E7
    C5 --> E8

    %% Alta / edición (UC-19.3)
    B2 --> C2
    C2 --> C3
    C3 --> C2
    C2 --> E1
    C2 --> E2
    C2 --> E5
    C2 --> B1

    %% Detalle + balance (UC-19.2)
    B1 --> B3
    B3 --> C1
    C1 --> E1

    %% Operaciones ejecutadas (UC-19.4)
    B3 --> B4
    B4 --> C6
    C6 --> C7
    C7 --> C6
    C6 --> E3
    C6 --> E2

    %% Salidas pesadas (UC-19.5)
    B3 --> B5
    B5 --> C8
    C8 --> C9
    C9 --> C8
    C8 --> E4

    %% Finalizar (UC-19.6) y encadenar (UC-19.7)
    B3 --> C12
    C12 --> C10
    C10 --> C12
    C12 --> C11
    C11 -.-> E1
    C12 --> E1

    %% Baja (UC-19.8) — única con ADMIN
    B3 --> C2
    C2 --> C4

    %% Relaciones
    E3 -. "ejecuta" .-> E7
    E2 -. "describe" .-> E3
    E5 -. "asigna" .-> E8

    %% ─────────── ESTILOS ───────────
    classDef actor      fill:#f3e5f5,stroke:#6a1b9a,color:#000;
    classDef boundary   fill:#e3f2fd,stroke:#1565c0,color:#000;
    classDef control    fill:#e8f5e9,stroke:#2e7d32,color:#000;
    classDef alerta     fill:#ffebee,stroke:#c62828,color:#000;
    classDef entity     fill:#fff3e0,stroke:#ef6c00,color:#000;

    class Act actor
    class B1,B2,B3,B4,B5 boundary
    class C1,C2,C3,C5,C6,C7,C8,C9,C10,C11,C12 control
    class C4 alerta
    class E1,E2,E3,E4,E5,E6,E7,E8 entity
```

---

## 2. Objetos identificados

### 2.1 Frontera

| Objeto | Pantalla real | Caso de uso |
|---|---|---|
| `ProcesamientosScreen` | `apps/mobile/src/screens/ProcesamientosScreen.tsx` | UC-19.1 |
| `ProcesamientoFormScreen` | `ProcesamientoFormScreen.tsx` (alta/edición) | UC-19.3 |
| `ProcesamientoDetailScreen` | `ProcesamientoDetailScreen.tsx` | UC-19.2 / UC-19.6–19.8 |
| `Sección Operaciones` | dentro del detalle | UC-19.4 |
| `Sección Salidas` | dentro del detalle | UC-19.5 |

### 2.2 Control

| Objeto | Implementación real | Responsabilidad |
|---|---|---|
| `OrdenesController` (lectura) | `apps/api/src/controllers/ordenes.controller.ts` | `getAll`, `getById`, `getBalance`, `getTrazabilidad`, `getStats` |
| `OrdenesController` (orden) | mismo archivo | `create`, `update`, `remove` |
| `OrdenesController` (operaciones) | mismo archivo | `addOperacion`, `updateOperacion`, `removeOperacion` |
| `OrdenesController` (salidas) | mismo archivo | `addSalida`, `updateSalida`, `removeSalida` |
| `OrdenesController` (cierre) | mismo archivo | `finalizar`, `encadenar` |
| `ValidarOrden` | `apps/api/src/validators/ordenes.validator.ts` | RN-1…RN-5 de UC-19.3 |
| `ValidarOperacionEjecutada` | `createOperacionEjecutadaSchema` | UC-19.4 |
| `ValidarSalida` | `createSalidaSchema` | RN-1…RN-4 de UC-19.5 |
| `Autenticar ADMIN` | `auth.middleware.ts` | **Solo** `DELETE /:id` |
| `Envios a Opciones` | `ordenes.ts` (`fetchRecetasActivas`, `fetchOperacionesActivas`, recepciones) | Desplegables del formulario |
| `ValidarBalance` | lógica de `ordenes.controller.ts` (`getBalance` + validación en `finalizar`) | Balance de masa antes de cerrar |
| `RegistrarEnKardex` | `ordenes.controller.ts` → `kardex` | Da entrada al inventario al finalizar |

### 2.3 Entidad

| Objeto | Clase (Parte 1) | Persistencia |
|---|---|---|
| `OrdenProcesamiento` | `OrdenProcesamiento` | `ordenes_procesamiento` |
| `OrdenOperacion` | `OrdenOperacion` | `orden_operaciones` |
| `OperacionEjecutada` | `OperacionEjecutada` | `operaciones_ejecutadas` |
| `SalidaPesada` | `SalidaPesada` | `salidas_pesadas` |
| `OrdenRecepcion` | `OrdenRecepcion` | `orden_recepciones` |
| `Receta` | `Receta` | `recetas` |
| `OperacionProceso` | `OperacionProceso` | `operaciones_proceso` |
| `Recepcion` | `Recepcion` | `recepciones` |

---

## 3. Trazabilidad flujo → objetos

| Paso (UC-19.3 / 19.4 / 19.5 / 19.6) | Frontera | Control | Entidad |
|---|---|---|---|
| Abrir lista de órdenes | `ProcesamientosScreen` | `OrdenesController` (getAll) | `OrdenProcesamiento` |
| Pulsar "Nueva orden" | `ProcesamientoFormScreen` | — | — |
| Seleccionar **receta** (precarga operaciones) | `ProcesamientoFormScreen` | `Envios a Opciones` | `Receta`, `OperacionProceso` |
| Asignar **recepciones** de entrada | `ProcesamientoFormScreen` | `Envios a Opciones` | `OrdenRecepcion`, `Recepcion` |
| Guardar orden | `ProcesamientoFormScreen` | `OrdenesController` (create) | `OrdenProcesamiento` |
| Registrar **operación ejecutada** | `Sección Operaciones` | `OrdenesController` (addOperacion) | `OperacionEjecutada` |
| Registrar **salida pesada** | `Sección Salidas` | `OrdenesController` (addSalida) | `SalidaPesada` |
| Ver **balance** y **trazabilidad** | `ProcesamientoDetailScreen` | `OrdenesController` (getBalance/getTrazabilidad) | `OrdenProcesamiento` |
| **Finalizar** (valida balance + kardex) | `ProcesamientoDetailScreen` | `ValidarBalance` + `RegistrarEnKardex` | `OrdenProcesamiento` |
| **Encadenar** etapa siguiente | `ProcesamientoDetailScreen` | `OrdenesController` (encadenar) | `OrdenProcesamiento` |
| Eliminar orden | `ProcesamientoDetailScreen` | `OrdenesController` (remove) + `Autenticar ADMIN` | `OrdenProcesamiento` |

---

## 4. Flujos alternos y excepciones

| Tipo | Condición | Reacción | Control |
|---|---|---|---|
| A1 | Sin `receta_id` | Se arman las operaciones a mano | `ValidarOrden` |
| A2 | `estado = BORRADOR` al crear | Válido; se cierra con `finalizar` | `ValidarOrden` |
| A3 | Edición parcial (`PUT` con mínimo 1 campo) | Válido | `ValidarOrden` |
| E1 | Falta `planta`, `responsable`, `fecha_inicio`, `etapa` o `producto_salida` | 400 | `ValidarOrden` |
| E2 | `etapa` fuera de {PRIMARIA, SECUNDARIA, EMPAQUE} | 400 | `ValidarOrden` |
| E3 | Recepción asignada con `cantidad_asignada` no positiva | 400 | `ValidarOrden` |
| E4 | Salida sin `tipo_salida`, `descripcion` o `cantidad` no positiva | 400 | `ValidarSalida` |
| E5 | **Balance de masa inconsistente** al finalizar | 400/409 con el detalle del descuadre | `ValidarBalance` |
| E6 | Usuario no `ADMIN` al **eliminar** | 403 | `Autenticar ADMIN` |

---

## 5. Hallazgos de la robustez

| # | Hallazgo | Impacto | Acción |
|---|---|---|---|
| R-1 | **RN-OPS-0 (seguridad):** solo `DELETE /:id` exige `ADMIN`. `create`, `update`, operaciones, salidas, `finalizar` y `encadenar` **son accesibles a cualquier usuario autenticado** | Inconsistencia de autorización | Marcado en rojo (`C4`) |
| R-2 | Rutas reales: `/api/ordenes-procesamiento`, `/api/operaciones-proceso`, `/api/recetas` | Corrige `02d` y diagramas previos | Registrado |
| R-3 | El **balance de masa** es un control propio (`ValidarBalance`) que solo actúa al `finalizar` | Diferente a otros módulos (validación al crear) | Control separado |
| R-4 | `finalizar` tiene **efecto lateral**: registra entrada en el **Kardex** | Acoplamiento entre UC-19 y UC-20 | Control `RegistrarEnKardex` |
| R-5 | `encadenar` **genera una nueva orden** (`orden_origen_id`) | Auto-referencia en el dominio | Documentado |
| R-6 | Las pantallas de Procesamiento **existen pero no están cableadas** en `AppStacks` (deuda D-2) | UC-19 no es accesible desde la navegación | **Deuda** |

> **Verificación ICONIX:** el flujo está completo; no hay objetos huérfanos. Se puede avanzar
> al **diagrama de secuencia** de este caso de uso.

# Análisis de Robustez — Gestión de Actividades Agrícolas (ICONIX · Parte 3)

> **Misma convención:** 🟦 Frontera · 🟩 Control · 🟧 Entidad · 🟪 Actor secundario.

**Caso de uso cubierto:** UC-15 *Gestionar actividades* (15.1 listado/filtros, 15.2 detalle,
15.3 alta/edición con insumos, mano de obra y maquinaria, 15.4 baja).

---

## 1. Diagrama de robustez

```mermaid
flowchart TB
    %% ─────────── ACTORES ───────────
    Act(["👤 Administrador"])
    Usu(["👤 Usuario<br/>(solo lectura)"])
    GPS(["📱 GPS<br/>(actor secundario)"])

    %% ─────────── FRONTERA ───────────
    subgraph FRONTERA["Frontera (pantallas del móvil)"]
        B1["ActividadesScreen<br/>(lista + filtros)"]
        B2["ActividadFormScreen<br/>(alta / edición)"]
        B3["ActividadDetailScreen<br/>(detalle)"]
    end

    %% ─────────── CONTROL ───────────
    subgraph CONTROL["Control (coordinación)"]
        C1{{"ActividadesController<br/>(getAll / getById / getStats)"}}
        C2{{"ActividadesController<br/>(create / update / remove)"}}
        C3{{"ValidarActividad<br/>(Joi: create/updateActividadSchema)"}}
        C4{{"ValidarListas<br/>(insumos / mano de obra / maquinaria)"}}
        C5{{"Autenticar ADMIN<br/>(adminMiddleware)"}}
        C6{{"Envios a Opciones<br/>(catálogo de cultivos)"}}
    end

    %% ─────────── ENTIDAD ───────────
    subgraph ENTIDAD["Entidad (dominio persistente)"]
        E1[("Actividad")]
        E2[("ActividadInsumo")]
        E3[("ActividadManoObra")]
        E4[("ActividadMaquinaria")]
        E5[("Cultivo")]
    end

    %% ─────────── FLUJO ───────────
    Usu --> B1
    B1 --> C1
    C1 --> E1
    E1 -. "se aplica a" .-> E5

    B1 --> B2
    Act --> B2
    GPS --> B2

    %% Alta / edición (UC-15.3)
    B2 --> C6
    C6 --> E5
    B2 --> C2
    C2 --> C5
    C5 --> C3
    C3 --> C4
    C4 --> C3
    C3 --> C2
    C2 --> E1
    C2 --> E2
    C2 --> E3
    C2 --> E4
    C2 --> B1

    %% Detalle (UC-15.2)
    B1 --> B3
    B3 --> C1
    C1 --> E1

    %% Baja (UC-15.4)
    B3 --> C2

    %% ─────────── ESTILOS ───────────
    classDef actor      fill:#f3e5f5,stroke:#6a1b9a,color:#000;
    classDef secundario fill:#ede7f6,stroke:#4527a0,color:#000;
    classDef boundary   fill:#e3f2fd,stroke:#1565c0,color:#000;
    classDef control    fill:#e8f5e9,stroke:#2e7d32,color:#000;
    classDef entity     fill:#fff3e0,stroke:#ef6c00,color:#000;

    class Act,Usu actor
    class GPS secundario
    class B1,B2,B3 boundary
    class C1,C2,C3,C4,C5,C6 control
    class E1,E2,E3,E4,E5 entity
```

---

## 2. Objetos identificados

### 2.1 Frontera

| Objeto | Pantalla real | Caso de uso |
|---|---|---|
| `ActividadesScreen` | `apps/mobile/src/screens/ActividadesScreen.tsx` | UC-15.1 |
| `ActividadFormScreen` | `ActividadFormScreen.tsx` (compartida alta/edición) | UC-15.3 |
| `ActividadDetailScreen` | `ActividadDetailScreen.tsx` | UC-15.2 / UC-15.4 |

### 2.2 Control

| Objeto | Implementación real | Responsabilidad |
|---|---|---|
| `ActividadesController` (lectura) | `apps/api/src/controllers/actividades.controller.ts` | `getAll`, `getById`, `getStats` |
| `ActividadesController` (escritura) | mismo archivo | `create`, `update`, `remove` |
| `ValidarActividad` | `apps/api/src/validators/actividades.validator.ts` | RN-1…RN-5 de UC-15.3 |
| `ValidarListas` | esquemas `insumoSchema`, `trabajadorSchema`, `maquinariaSchema` | Cada fila exige `producto` / `trabajador` / `equipo` |
| `Autenticar ADMIN` | `auth.middleware.ts` (`adminMiddleware`) | Escritura solo `ADMIN` |
| `Envios a Opciones` | `catalogos.ts` (`fetchCultivosOpciones`) | Desplegable de cultivos (FK obligatoria) |

### 2.3 Entidad

| Objeto | Clase (Parte 1) | Persistencia |
|---|---|---|
| `Actividad` | `Actividad` | `actividades` |
| `ActividadInsumo` | `ActividadInsumo` | `actividad_insumos` |
| `ActividadManoObra` | `ActividadManoObra` | `actividad_manobra` |
| `ActividadMaquinaria` | `ActividadMaquinaria` | `actividad_maquinaria` |
| `Cultivo` | `Cultivo` | `cultivos` (FK obligatoria) |

---

## 3. Trazabilidad flujo → objetos

| Paso (UC-15.3) | Frontera | Control | Entidad |
|---|---|---|---|
| Abrir lista de actividades | `ActividadesScreen` | `ActividadesController` (getAll) | `Actividad` |
| Filtrar (`search`, `estado`, `tipo_actividad`, `cultivo_id`) | `ActividadesScreen` | `getAllActividadesSchema` | — |
| Pulsar "Nueva actividad" | `ActividadFormScreen` | — | — |
| Seleccionar **cultivo** (FK) | `ActividadFormScreen` | `Envios a Opciones` | `Cultivo` |
| Capturar ubicación GPS | `ActividadFormScreen` | — | `Actividad` (lat/lng) |
| Agregar filas de **insumos** | `ActividadFormScreen` | `ValidarListas` | `ActividadInsumo` |
| Agregar filas de **mano de obra** | `ActividadFormScreen` | `ValidarListas` | `ActividadManoObra` |
| Agregar filas de **maquinaria** | `ActividadFormScreen` | `ValidarListas` | `ActividadMaquinaria` |
| Guardar | `ActividadFormScreen` | `ActividadesController` (create) | `Actividad` |
| Verificar permiso | — | `Autenticar ADMIN` | `Usuario` |
| Validar campos y enums | — | `ValidarActividad` | — |
| Ver detalle | `ActividadDetailScreen` | `ActividadesController` (getById) | `Actividad` |
| Eliminar actividad | `ActividadDetailScreen` | `ActividadesController` (remove) | `Actividad` |

---

## 4. Flujos alternos y excepciones

| Tipo | Condición | Reacción | Control |
|---|---|---|---|
| A1 | `codigo` vacío | Autogenerado por el backend | `ActividadesController` |
| A2 | Edición parcial (`PUT` con mínimo 1 campo) | Válido; las listas **reemplazan** las existentes | `ValidarActividad` |
| A3 | Actividad sin insumos/mano de obra/maquinaria | Válido (listas opcionales) | `ValidarListas` |
| E1 | Falta `cultivo_id`, `fecha`, `tipo_actividad` o `responsable_tecnico` | 400 | `ValidarActividad` |
| E2 | `hora_inicio`/`hora_fin` con formato ≠ `HH:MM` | 400 "Formato de hora inválido (HH:MM)" | `ValidarActividad` |
| E3 | Fila de insumo sin `producto`, mano de obra sin `trabajador` o maquinaria sin `equipo` | 400 | `ValidarListas` |
| E4 | Enum fuera de rango (`tipo_actividad`, `prioridad`, `estado`) | 400 | `ValidarActividad` |
| E5 | Usuario no `ADMIN` en escritura | 403 | `Autenticar ADMIN` |
| E6 | Fallo al cargar cultivos | El formulario permite reintentar | `Envios a Opciones` |

---

## 5. Hallazgos de la robustez

| # | Hallazgo | Impacto | Acción |
|---|---|---|---|
| R-1 | `create`/`update` usan **`PUT`** (≠ `PATCH` de campañas) | Contrato del API | Registrado |
| R-2 | Son **3 listas anidadas** (insumos, mano de obra, maquinaria), cada una con su mapper (`mapInsumosToBackend`, `mapManoObraToBackend`, `mapMaquinariaToBackend`) | El caso de uso es el más complejo del módulo Campo | Control `ValidarListas` separado |
| R-3 | Al editar, las listas **reemplazan** las existentes (no se difieren) | Dato crítico para el diagrama de secuencia | Documentado |
| R-4 | El formulario exige un **desplegable de cultivos** (FK obligatoria) | Control `Envios a Opciones` es crítico | Añadido |
| R-5 | El **GPS** aporta `latitud`, `longitud`, `altitud`, `precision_gps` como texto (no número) | Diferente a parcelas (donde son números validados por rango) | Registrado |
| R-6 | `SYSTEM.md` menciona `actividad_fotos`, pero **ni** el validador **ni** el servicio lo manejan | Sub-recurso inexistente en el flujo móvil | **Deuda** — no modelado |

> **Verificación ICONIX:** el flujo está completo; no hay objetos huérfanos. Se puede avanzar
> al **diagrama de secuencia** de este caso de uso.

# Análisis de Robustez — Inspecciones Internas (SIC) (ICONIX · Parte 3)

> **Misma convención:** 🟦 Frontera · 🟩 Control · 🟧 Entidad · 🟪 Actor secundario.

**Caso de uso cubierto:** UC-16 *Gestionar inspecciones* (16.1 listado/filtros, 16.2 detalle,
16.3 alta/edición con checklist, no conformidades y evidencias, 16.4 baja).

---

## 1. Diagrama de robustez

```mermaid
flowchart TB
    %% ─────────── ACTORES ───────────
    Act(["👤 Administrador"])
    Usu(["👤 Usuario<br/>(solo lectura)"])
    GPS(["📱 GPS<br/>(actor secundario)"])
    Files(["🗂️ Servicio de archivos<br/>(actor secundario)"])

    %% ─────────── FRONTERA ───────────
    subgraph FRONTERA["Frontera (pantallas del móvil)"]
        B1["InspeccionesScreen<br/>(lista + filtros)"]
        B2["InspeccionFormScreen<br/>(alta / edición)"]
        B3["InspeccionDetailScreen<br/>(detalle)"]
    end

    %% ─────────── CONTROL ───────────
    subgraph CONTROL["Control (coordinación)"]
        C1{{"InspeccionesController<br/>(getAll / getById / getGlobalStats)"}}
        C2{{"InspeccionesController<br/>(create / update / remove)"}}
        C3{{"ValidarInspeccion<br/>(Joi: create/updateInspeccionSchema)"}}
        C4{{"ValidarListas<br/>(checklist / no conformidades / evidencias)"}}
        C5{{"Autenticar ADMIN<br/>(adminMiddleware)"}}
        C6{{"Envios a Opciones<br/>(catálogo de cultivos)"}}
        C7{{"Catálogos del cliente<br/>(tipos de no conformidad,<br/>categorías, criterios)"}}
    end

    %% ─────────── ENTIDAD ───────────
    subgraph ENTIDAD["Entidad (dominio persistente)"]
        E1[("Inspeccion")]
        E2[("CriterioChecklist")]
        E3[("NoConformidad")]
        E4[("AccionCorrectiva")]
        E5[("Evidencia")]
        E6[("Cultivo")]
    end

    %% ─────────── FLUJO ───────────
    Usu --> B1
    B1 --> C1
    C1 --> E1
    E1 -. "se aplica a" .-> E6

    B1 --> B2
    Act --> B2
    GPS --> B2
    Files --> B2

    %% Alta / edición (UC-16.3)
    B2 --> C6
    C6 --> E6
    B2 --> C7
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
    C2 --> E5
    C2 --> B1

    %% Detalle (UC-16.2)
    B1 --> B3
    B3 --> C1
    C1 --> E1

    %% Baja (UC-16.4)
    B3 --> C2

    %% Relaciones de dominio
    E3 -. "genera" .-> E4
    E1 -. "verifica" .-> E2
    E1 -. "adjunta" .-> E5

    %% ─────────── ESTILOS ───────────
    classDef actor      fill:#f3e5f5,stroke:#6a1b9a,color:#000;
    classDef secundario fill:#ede7f6,stroke:#4527a0,color:#000;
    classDef boundary   fill:#e3f2fd,stroke:#1565c0,color:#000;
    classDef control    fill:#e8f5e9,stroke:#2e7d32,color:#000;
    classDef entity     fill:#fff3e0,stroke:#ef6c00,color:#000;

    class Act,Usu actor
    class GPS,Files secundario
    class B1,B2,B3 boundary
    class C1,C2,C3,C4,C5,C6,C7 control
    class E1,E2,E3,E4,E5,E6 entity
```

---

## 2. Objetos identificados

### 2.1 Frontera

| Objeto | Pantalla real | Caso de uso |
|---|---|---|
| `InspeccionesScreen` | `apps/mobile/src/screens/InspeccionesScreen.tsx` | UC-16.1 |
| `InspeccionFormScreen` | `InspeccionFormScreen.tsx` (compartida alta/edición) | UC-16.3 |
| `InspeccionDetailScreen` | `InspeccionDetailScreen.tsx` | UC-16.2 / UC-16.4 |

### 2.2 Control

| Objeto | Implementación real | Responsabilidad |
|---|---|---|
| `InspeccionesController` (lectura) | `apps/api/src/controllers/inspecciones.controller.ts` | `getAll`, `getById`, `getGlobalStats` |
| `InspeccionesController` (escritura) | mismo archivo | `create`, `update`, `remove` |
| `ValidarInspeccion` | `apps/api/src/validators/inspecciones.validator.ts` | RN-1…RN-8 de UC-16.3 |
| `ValidarListas` | `checklistItemSchema`, `noConformidadSchema`, `accionCorrectivaSchema`, `evidenciaSchema` | Cada fila exige su campo obligatorio |
| `Autenticar ADMIN` | `auth.middleware.ts` (`adminMiddleware`) | Escritura solo `ADMIN` |
| `Envios a Opciones` | `catalogos.ts` (`fetchCultivosOpciones`) | Desplegable de cultivos (FK obligatoria) |
| `Catálogos del cliente` | `inspecciones.ts` (constantes `*Options`) | Tipos de no conformidad, categorías, criterios de checklist |

### 2.3 Entidad

| Objeto | Clase (Parte 1) | Persistencia |
|---|---|---|
| `Inspeccion` | `Inspeccion` | `inspecciones` |
| `CriterioChecklist` | `CriterioChecklist` | `inspeccion_checklist` |
| `NoConformidad` | `NoConformidad` | `inspeccion_no_conformidades` |
| `AccionCorrectiva` | `AccionCorrectiva` | `inspeccion_acciones_correctivas` |
| `Evidencia` | `Evidencia` | `inspeccion_evidencias` |
| `Cultivo` | `Cultivo` | `cultivos` (FK obligatoria) |

---

## 3. Trazabilidad flujo → objetos

| Paso (UC-16.3) | Frontera | Control | Entidad |
|---|---|---|---|
| Abrir lista de inspecciones | `InspeccionesScreen` | `InspeccionesController` (getAll) | `Inspeccion` |
| Filtrar (`search`, `estado`, `cultivo_id`) | `InspeccionesScreen` | `getAllInspeccionesSchema` | — |
| Pulsar "Nueva inspección" | `InspeccionFormScreen` | — | — |
| Seleccionar **cultivo** (FK) | `InspeccionFormScreen` | `Envios a Opciones` | `Cultivo` |
| Capturar ubicación GPS | `InspeccionFormScreen` | — | `Inspeccion` (lat/lng) |
| Cargar tipos/categorías/criterios | `InspeccionFormScreen` | `Catálogos del cliente` | — |
| Agregar filas del **checklist** | `InspeccionFormScreen` | `ValidarListas` | `CriterioChecklist` |
| Agregar **no conformidades** + acciones | `InspeccionFormScreen` | `ValidarListas` | `NoConformidad`, `AccionCorrectiva` |
| Agregar **evidencias** | `InspeccionFormScreen` | `ValidarListas` + `Servicio de archivos` | `Evidencia` |
| Guardar | `InspeccionFormScreen` | `InspeccionesController` (create) | `Inspeccion` |
| Verificar permiso | — | `Autenticar ADMIN` | `Usuario` |
| Validar campos y enums | — | `ValidarInspeccion` | — |
| Ver detalle | `InspeccionDetailScreen` | `InspeccionesController` (getById) | `Inspeccion` |
| Eliminar inspección | `InspeccionDetailScreen` | `InspeccionesController` (remove) | `Inspeccion` |

---

## 4. Flujos alternos y excepciones

| Tipo | Condición | Reacción | Control |
|---|---|---|---|
| A1 | `codigo` vacío | Autogenerado por el backend | `InspeccionesController` |
| A2 | Guardar en **borrador** (`estado = PENDIENTE` sin `resultado`) | Válido | `ValidarInspeccion` |
| A3 | Edición parcial (`PUT` con mínimo 1 campo); las listas **reemplazan** | Válido | `ValidarInspeccion` |
| E1 | Falta `cultivo_id`, `fecha` o `inspector` | 400 | `ValidarInspeccion` |
| E2 | Ítem de checklist sin `criterio` | 400 | `ValidarListas` |
| E3 | No conformidad sin `tipo`, `categoria`, `descripcion` o `responsable` | 400 | `ValidarListas` |
| E4 | Acción correctiva sin `accion` o `responsable` | 400 | `ValidarListas` |
| E5 | Enum fuera de rango (`estado`, `resultado`, `riesgo_general`, `severidad`…) | 400 | `ValidarInspeccion` |
| E6 | Usuario no `ADMIN` en escritura | 403 | `Autenticar ADMIN` |
| E7 | Fallo al subir evidencia | El formulario permite reintentar | `Servicio de archivos` |

---

## 5. Hallazgos de la robustez

| # | Hallazgo | Impacto | Acción |
|---|---|---|---|
| R-1 | `create`/`update` usan **`PUT`** (≠ `PATCH` de campañas) | Contrato del API | Registrado |
| R-2 | Es el **anidamiento más profundo** del sistema: `no_conformidades[].acciones[]` (2 niveles) + `checklist[]` + `evidencias[]` | Caso de uso más complejo en cantidad de entidades (6) | Control `ValidarListas` robusto |
| R-3 | `inspeccionToBackend()` / `inspeccionToFrontend()` serializan el árbol completo | Sí — no era explícito | Documentado |
| R-4 | El formulario exige un **desplegable de cultivos** (FK obligatoria) | Control `Envios a Opciones` es crítico | Añadido |
| R-5 | Los **tipos de no conformidad, categorías y criterios de checklist** están **hardcodeados en el cliente** (`*Options`), aunque el API tiene el catálogo `criterios-checklist` | Posible divergencia entre móvil y API | **Deuda** — control `Catálogos del cliente` |
| R-6 | `SYSTEM.md` menciona `inspeccion_historial`, pero ni el validador ni el servicio lo manejan | Sub-recurso inexistente en el flujo móvil | **Deuda** — no modelado |

> **Verificación ICONIX:** el flujo está completo; no hay objetos huérfanos. Se puede avanzar
> al **diagrama de secuencia** de este caso de uso.

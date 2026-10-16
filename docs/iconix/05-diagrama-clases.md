# Diagrama de Clases del Sistema (ICONIX · Parte 5)

> **Metodología ICONIX.** El diagrama de clases se consolida a partir de las secuencias
> (Parte 4): cada `participant` de tipo entidad se convierte en una clase.
>
> **Fuente de verdad:** `packages/database/prisma/schema.prisma` (30 modelos, 53 enums).
>
> **Alcance:** un **único diagrama global** con la **mayoría** de los atributos de cada clase.
> Los campos de auditoría compartidos (`created_at`, `updated_at`, `activo`, `created_by`,
> `updated_by`) se documentan una sola vez en §3 para no saturar el diagrama.

**Contenido**
1. [Diagrama de clases global](#1-diagrama-de-clases-global)
2. [Relaciones y multiplicidades](#2-relaciones-y-multiplicidades)
3. [Campos de auditoría compartidos](#3-campos-de-auditoría-compartidos)
4. [Enums del dominio](#4-enums-del-dominio)
5. [Notas de implementación](#5-notas-de-implementación)

---

## 1. Diagrama de clases global

```mermaid
classDiagram
    direction TB

    %% ══════════════ SEGURIDAD ══════════════
    class Usuario {
        +id : String uuid(36)
        +nombre : String(100)
        +email : String(150) unique
        +password : String(255) bcrypt
        +rol : Rol
        +rol_sic : RolSic nullable
        +activo : Boolean
    }
    class RefreshToken {
        +id : String uuid(36)
        +jti : String(36) unique
        +user_id : String(36)
        +token_hash : String(64)
        +expires_at : DateTime
        +revoked : Boolean
        +replaced_by : String(36) nullable
        +created_at : DateTime
    }

    %% ══════════════ SOCIOS ══════════════
    class Productor {
        +id : Int
        +codigo : String(20) unique
        +dni : String(8) unique
        +nombres : String(100)
        +apellido_paterno : String(100)
        +apellido_materno : String(100)
        +sexo : Sexo
        +fecha_nacimiento : DateTime
        +estado_civil : EstadoCivil
        +telefono : String(20) nullable
        +correo : String(150) nullable
        +departamento : String(100)
        +provincia : String(100)
        +distrito : String(100)
        +comunidad : String(150)
        +direccion : Text nullable
        +nivel_educativo : NivelEducativo
        +idioma_principal : Idioma
        +idioma_secundario : Idioma
        +material_vivienda : String(50) nullable
        +acceso_agua : String(10) nullable
        +acceso_energia : String(10) nullable
        +acceso_internet : String(10) nullable
        +seguro_salud : String(50) nullable
        +acceso_credito : String(10) nullable
        +servicio_sanitario : String(50) nullable
        +estado : EstadoProductor
        +fecha_ingreso : DateTime
        +organizacion : String(200)
        +cargo : CargoProductor
        +foto_url : String(500) nullable
        +firma_url : String(500) nullable
    }
    class Familiar {
        +id : Int
        +nombres : String(200)
        +parentesco : String(50)
        +dni : String(8) nullable
        +sexo : Sexo
        +fecha_nacimiento : DateTime
        +ocupacion : String(100) nullable
        +nivel_educativo : NivelEducativo nullable
        +telefono : String(20) nullable
        +dependiente : Boolean
        +vive_con_productor : Boolean
    }
    class Documento {
        +id : Int
        +tipo : String(100)
        +categoria : CategoriaDocumento
        +nombre_archivo : String(255)
        +ruta_archivo : String(500)
        +tamano_bytes : Int
        +mime_type : String(100)
        +estado : EstadoDocumento
    }

    %% ══════════════ CAMPO ══════════════
    class Parcela {
        +id : Int
        +codigo : String(20) unique
        +nombre : String(200)
        +cultivo : String(100)
        +area : Decimal(10,2)
        +area_certificada : Decimal(10,2) nullable
        +area_unidad : String(10)
        +ubicacion : String(200) nullable
        +certificacion : CertificacionParcela
        +estado : EstadoParcela
        +comunidad : String(150) nullable
        +sector : String(150) nullable
        +altitud : String(50) nullable
        +departamento : String(100) nullable
        +provincia : String(100) nullable
        +distrito : String(100) nullable
        +centro_poblado : String(150) nullable
        +ubigeo : String(6) nullable
        +latitud : String(30) nullable
        +longitud : String(30) nullable
        +precision_gps : String(20) nullable
        +tipo_suelo : String(100) nullable
        +textura : String(50) nullable
        +pendiente : String(100) nullable
        +fuente_agua : String(100) nullable
        +sistema_riego : String(100) nullable
        +zona_agroecologica : String(100) nullable
        +disponibilidad_agua : String(50) nullable
        +observaciones : Text nullable
        +area_calculada : String(50) nullable
        +perimetro : String(50) nullable
        +vertices : Int nullable
        +poligono : Text nullable
        +fecha_levantamiento : DateTime nullable
        +responsable : String(150) nullable
        +acreditacion : String(50) nullable
        +utm_este : String(20) nullable
        +utm_norte : String(20) nullable
        +utm_zona : String(10) nullable
    }
    class ParcelaDocumento {
        +id : Int
        +tipo : String(100)
        +nombre_archivo : String(255)
        +ruta_archivo : String(500)
        +tamano_bytes : Int
        +mime_type : String(100)
        +estado : String(20)
    }
    class ParcelaFoto {
        +id : Int
        +titulo : String(150)
        +descripcion : String(500) nullable
        +fecha : DateTime nullable
        +autor : String(150) nullable
        +observaciones : Text nullable
        +ruta_archivo : String(500) nullable
    }
    class ParcelaHistorial {
        +id : Int
        +tipo : String(50)
        +titulo : String(200)
        +descripcion : Text nullable
        +usuario : String(150) nullable
        +created_at : DateTime
    }
    class Campania {
        +id : Int
        +codigo : String(20) unique
        +nombre : String(200)
        +anio_agricola : String(10)
        +fecha_inicio : DateTime
        +fecha_fin : DateTime
        +descripcion : Text nullable
        +estado : EstadoCampania
        +responsable : String(150)
        +tecnico_coordinador : String(150)
        +objetivo : Text nullable
        +permitir_cultivos : Boolean
        +permitir_actividades : Boolean
        +permitir_cosechas : Boolean
        +permitir_inspecciones : Boolean
        +permitir_acopio : Boolean
        +permitir_procesamiento : Boolean
        +visible : Boolean
        +activa : Boolean
        +observaciones : Text nullable
    }
    class Cultivo {
        +id : Int
        +codigo : String(20) unique
        +cultivo : String(100)
        +variedad : String(100) nullable
        +area_sembrada : Decimal(10,2) nullable
        +fecha_siembra : DateTime nullable
        +metodo_siembra : MetodoSiembra nullable
        +sistema_productivo : SistemaProductivo nullable
        +tipo_agricultura : TipoAgricultura nullable
        +certificacion : CertificacionCultivo nullable
        +procedencia_semilla : ProcedenciaSemilla nullable
        +cantidad_semilla : Decimal(10,2) nullable
        +unidad_semilla : String(10) nullable
        +fecha_cosecha : DateTime nullable
        +estado : EstadoCultivo
        +observaciones : Text nullable
        +rendimiento_esperado : Decimal(10,2) nullable
        +produccion_estimada : Decimal(10,2) nullable
        +destino_produccion : DestinoProduccion nullable
        +distanciamiento_surcos : String(50) nullable
        +distanciamiento_plantas : String(50) nullable
        +densidad_siembra : String(50) nullable
        +tipo_semilla : String(100) nullable
        +lote_semilla : String(100) nullable
        +proveedor_semilla : String(150) nullable
    }
    class Actividad {
        +id : Int
        +codigo : String(20) unique
        +fecha : DateTime
        +tipo_actividad : TipoActividad
        +descripcion : Text nullable
        +responsable_tecnico : String(150)
        +hora_inicio : String(5) nullable
        +hora_fin : String(5) nullable
        +duracion_estimada : String(50) nullable
        +prioridad : PrioridadActividad
        +estado : EstadoActividad
        +jornales : Int nullable
        +latitud : String(30) nullable
        +longitud : String(30) nullable
        +altitud : String(50) nullable
        +precision_gps : String(20) nullable
        +observaciones_tecnicas : Text nullable
        +recomendaciones : Text nullable
        +objetivo : Text nullable
        +resultado : Text nullable
        +proxima_actividad : String(200) nullable
    }
    class Insumo {
        +id : String uuid(36)
        +producto : String(150)
        +categoria : String(100) nullable
        +fabricante : String(150) nullable
        +cantidad : Decimal(10,2) nullable
        +unidad : String(20) nullable
        +lote : String(100) nullable
        +costo_unitario : Decimal(10,2) nullable
        +costo_total : Decimal(10,2) nullable
        +observaciones : Text nullable
    }
    class ManoDeObra {
        +id : String uuid(36)
        +trabajador : String(150)
        +funcion : String(100) nullable
        +jornales : Decimal(5,2) nullable
        +horas : Decimal(5,2) nullable
        +costo_jornal : Decimal(10,2) nullable
        +costo_total : Decimal(10,2) nullable
        +observaciones : Text nullable
    }
    class Maquinaria {
        +id : String uuid(36)
        +equipo : String(150)
        +operador : String(150) nullable
        +horas_uso : Decimal(5,2) nullable
        +costo_hora : Decimal(10,2) nullable
        +costo_total : Decimal(10,2) nullable
        +combustible : Decimal(10,2) nullable
        +observaciones : Text nullable
    }

    %% ══════════════ CALIDAD ══════════════
    class Inspeccion {
        +id : Int
        +codigo : String(20) unique
        +fecha : DateTime
        +inspector : String(150)
        +estado : EstadoInspeccion
        +resultado : ResultadoInspeccion nullable
        +latitud : String(30) nullable
        +longitud : String(30) nullable
        +altitud : String(50) nullable
        +precision_gps : String(20) nullable
        +observaciones : Text nullable
        +comentarios_productor : Text nullable
        +recomendaciones : Text nullable
        +prioridad_recomendacion : String(150) nullable
        +responsable_recomendacion : String(150) nullable
        +fecha_recomendacion : DateTime nullable
        +riesgo_general : RiesgoNivel nullable
        +resumen_ejecutivo : Text nullable
        +fecha_proxima_inspeccion : DateTime nullable
        +nivel_cumplimiento : String(50) nullable
    }
    class CriterioChecklist {
        +id : Int
        +criterio : String(200)
        +cumplimiento : CumplimientoCriterio nullable
        +riesgo : RiesgoNivel
        +observacion : Text nullable
        +evidencia : String(500) nullable
    }
    class NoConformidad {
        +id : Int
        +codigo : String(20)
        +tipo : String(100)
        +categoria : String(100)
        +descripcion : Text
        +severidad : SeveridadNoConformidad
        +responsable : String(150)
        +fecha_compromiso : DateTime nullable
        +estado : EstadoNoConformidad
        +accion_correctiva : Text nullable
    }
    class AccionCorrectiva {
        +id : Int
        +accion : Text
        +responsable : String(150)
        +fecha_inicio : DateTime nullable
        +fecha_limite : DateTime nullable
        +estado : EstadoAccionCorrectiva
        +observaciones : Text nullable
    }
    class Evidencia {
        +id : Int
        +nombre : String(255)
        +descripcion : String(500) nullable
        +tipo : String(100) nullable
        +ruta_archivo : String(500) nullable
        +fecha : DateTime nullable
        +responsable : String(150) nullable
    }

    %% ══════════════ OPERACIONES ══════════════
    class Acopio {
        +id : Int
        +codigo : String(20) unique
        +fecha : DateTime
        +acopiador : String(150)
        +vehiculo : String(100) nullable
        +ruta_acopio : String(200) nullable
        +total_sacos : Int
        +peso_total : Decimal(10,2)
        +peso_bruto : Decimal(10,2)
        +tara : Decimal(10,2)
        +peso_neto : Decimal(10,2)
        +estado : EstadoAcopio
        +observaciones : Text nullable
    }
    class AcopioDetalle {
        +id : Int
        +total_sacos : Int
        +peso_total : Decimal(10,2)
        +observaciones : Text nullable
    }
    class Saco {
        +id : String uuid(36)
        +codigo : String(50)
        +peso : Decimal(10,2)
        +observaciones : Text nullable
    }
    class Recepcion {
        +id : Int
        +codigo : String(20) unique
        +lote_productor : String(100) nullable
        +fecha : DateTime
        +responsable : String(150)
        +planta : String(100)
        +sacos : Int
        +peso_campo : Decimal(10,2) nullable
        +peso_bruto : Decimal(10,2) nullable
        +tara : Decimal(10,2) nullable
        +peso_neto : Decimal(10,2) nullable
        +diferencia : Decimal(10,2) nullable
        +merma : Decimal(5,2) nullable
        +humedad : Decimal(5,2) nullable
        +impurezas : Decimal(5,2) nullable
        +materia_extrana : Decimal(5,2) nullable
        +color : String(50) nullable
        +olor : String(50) nullable
        +presencia_insectos : String(50) nullable
        +estado_producto : EstadoProducto nullable
        +categoria : CategoriaRecepcion nullable
        +destino : DestinoRecepcion nullable
        +resultado : ResultadoRecepcion nullable
        +motivo : Text nullable
        +estado : EstadoRecepcion
        +observaciones : Text nullable
        +documento_firmado : Boolean
        +firma_responsable_url : String(500) nullable
    }
    class RecepcionSaco {
        +id : Int
        +codigo : String(50)
        +peso : Decimal(10,2)
        +observaciones : Text nullable
        +created_at : DateTime
    }
    class OperacionProceso {
        +id : Int
        +codigo : String(20) unique
        +nombre : String(100)
        +descripcion : String(500) nullable
        +orden : Int
        +activo : Boolean
    }
    class Receta {
        +id : Int
        +codigo : String(20) unique
        +nombre : String(150)
        +producto_base : String(100)
        +etapa : EtapaProceso
        +formato_salida : FormatoSalida nullable
        +descripcion : Text nullable
        +activo : Boolean
    }
    class RecetaOperacion {
        +id : Int
        +orden : Int
        +requerida : Boolean
        +parametros_default : Text nullable
    }
    class OrdenProcesamiento {
        +id : Int
        +codigo : String(20) unique
        +planta : String(100)
        +responsable : String(150)
        +fecha_inicio : DateTime
        +fecha_fin : DateTime nullable
        +estado : EstadoOrden
        +etapa : EtapaProceso
        +formato_salida : FormatoSalida
        +producto_salida : String(150)
        +peso_entrada : Decimal(12,2)
        +peso_salida_total : Decimal(12,2)
        +merma_total : Decimal(12,2)
        +rendimiento : Decimal(5,2)
        +humedad_final : Decimal(5,2) nullable
        +calidad : CalidadProducto nullable
        +balance_ok : Boolean
        +observaciones : Text nullable
    }
    class OrdenOperacion {
        +id : Int
        +orden : Int
        +fecha : DateTime
        +operario : String(150) nullable
        +peso_antes : Decimal(12,2) nullable
        +peso_despues : Decimal(12,2) nullable
        +humedad : Decimal(5,2) nullable
        +resultado : String(50) nullable
        +observaciones : Text nullable
        +completada : Boolean
    }
    class OrdenSalida {
        +id : Int
        +tipo_salida : TipoSalida
        +descripcion : String(200)
        +cantidad : Decimal(12,2)
        +unidad : UnidadMedida
        +humedad : Decimal(5,2) nullable
        +destino : DestinoSalida
        +cuenta_en_balance : Boolean
        +observaciones : Text nullable
        +created_at : DateTime
    }
    class OrdenRecepcion {
        +id : Int
        +cantidad_asignada : Decimal(12,2)
        +observaciones : Text nullable
        +created_at : DateTime
    }
    class Kardex {
        +id : Int
        +codigo : String(20) unique
        +producto : String(200)
        +categoria : CategoriaKardex
        +origen : OrigenKardex
        +etapa : EtapaProceso nullable
        +unidad : String(10)
        +cantidad_actual : Decimal(10,2)
        +cantidad_minima : Decimal(10,2) nullable
        +cantidad_maxima : Decimal(10,2) nullable
        +ubicacion : String(200) nullable
        +estado : EstadoKardex
        +fecha_ingreso : DateTime
        +fecha_vencimiento : DateTime nullable
        +proveedor : String(200) nullable
        +costo_unitario : Decimal(10,2) nullable
        +observaciones : Text nullable
    }
    class KardexMovimiento {
        +id : Int
        +tipo : TipoMovimiento
        +cantidad : Decimal(10,2)
        +saldo_anterior : Decimal(10,2)
        +saldo_posterior : Decimal(10,2)
        +origen : OrigenKardex
        +destino : String(200) nullable
        +referencia : String(200) nullable
        +referencia_tipo : String(50) nullable
        +referencia_id : Int nullable
        +responsable : String(150) nullable
        +observaciones : Text nullable
        +fecha : DateTime
    }

    %% ══════════════ ADMINISTRACIÓN ══════════════
    class Catalogo {
        +id : Int
        +tipo : String(50)
        +nombre : String(500)
        +descripcion : String(500) nullable
        +activo : Boolean
        +orden : Int
    }
    class Ubigeo {
        +id : Int
        +ubigeo : Char(6) unique
        +dpto : String(32)
        +prov : String(32)
        +distrito : String(32)
    }

    %% ══════════════ RELACIONES ══════════════
    Usuario "1" --> "*" RefreshToken : emite
    Usuario "1" --> "*" Productor : crea

    Ubigeo "1" --> "*" Productor : ubica
    Ubigeo "1" --> "*" Parcela : ubica

    Productor "1" --> "*" Familiar : tiene
    Productor "1" --> "*" Documento : adjunta
    Productor "1" --> "*" Parcela : posee

    Parcela "1" --> "*" ParcelaDocumento : adjunta
    Parcela "1" --> "*" ParcelaFoto : documenta
    Parcela "1" --> "*" ParcelaHistorial : registra
    Parcela "1" --> "*" Cultivo : aloja

    Campania "1" --> "*" Cultivo : agrupa
    Cultivo "1" --> "*" Actividad : recibe
    Cultivo "1" --> "*" Inspeccion : verifica

    Actividad "1" --> "*" Insumo : consume
    Actividad "1" --> "*" ManoDeObra : emplea
    Actividad "1" --> "*" Maquinaria : usa

    Inspeccion "1" --> "*" CriterioChecklist : verifica
    Inspeccion "1" --> "*" NoConformidad : detecta
    Inspeccion "1" --> "*" Evidencia : adjunta
    NoConformidad "1" --> "*" AccionCorrectiva : genera

    Acopio "1" --> "*" AcopioDetalle : desglosa
    AcopioDetalle "1" --> "*" Saco : contiene
    AcopioDetalle "*" --> "1" Productor : de
    AcopioDetalle "*" --> "1" Cultivo : de
    AcopioDetalle "*" --> "0..1" Parcela : de
    Acopio "0..1" --> "*" Recepcion : da origen
    Recepcion "1" --> "*" RecepcionSaco : contiene

    Receta "1" --> "*" RecetaOperacion : define
    OperacionProceso "1" --> "*" RecetaOperacion : participa
    Receta "0..1" --> "*" OrdenProcesamiento : guía

    OrdenProcesamiento "1" --> "*" OrdenOperacion : ejecuta
    OrdenProcesamiento "1" --> "*" OrdenSalida : produce
    OrdenProcesamiento "1" --> "*" OrdenRecepcion : consume
    OrdenOperacion "*" --> "1" OperacionProceso : aplica
    OrdenRecepcion "*" --> "1" Recepcion : asigna
    OrdenProcesamiento "0..1" --> "0..1" OrdenProcesamiento : encadena

    Kardex "1" --> "*" KardexMovimiento : registra
    OrdenProcesamiento "1" ..> "*" Kardex : da entrada al finalizar

    Catalogo ..> Ubigeo : complementa
```

---

## 2. Relaciones y multiplicidades

| Asociación | Multiplicidad | Tipo | Tabla puente |
|---|---|---|---|
| `Usuario` → `RefreshToken` | 1 a N | Composición | — |
| `Usuario` → `Productor` (crea) | 1 a N | Asociación | — |
| `Ubigeo` → `Productor` / `Parcela` | 1 a N | Asociación | — |
| `Productor` → `Familiar` | 1 a N | Composición | — |
| `Productor` → `Documento` | 1 a N | Composición | — |
| `Productor` → `Parcela` | 1 a N | Composición | — |
| `Parcela` → `ParcelaDocumento` / `ParcelaFoto` / `ParcelaHistorial` | 1 a N | Composición | — |
| `Parcela` → `Cultivo` | 1 a N | Composición | — |
| `Campania` → `Cultivo` | 1 a N | Composición | — |
| `Cultivo` → `Actividad` | 1 a N | Composición | — |
| `Cultivo` → `Inspeccion` | 1 a N | Composición | — |
| `Actividad` ↔ `Insumo` | N a N | Asociación | `Insumo_has_actividades` |
| `Actividad` ↔ `ManoDeObra` | N a N | Asociación | `Mano_de_obra_has_actividades` |
| `Actividad` ↔ `Maquinaria` | N a N | Asociación | `Maquinaria_has_actividades` |
| `Inspeccion` → `CriterioChecklist` / `NoConformidad` / `Evidencia` | 1 a N | Composición | — |
| `NoConformidad` → `AccionCorrectiva` | 1 a N | Composición | — |
| `Acopio` → `AcopioDetalle` | 1 a N | Composición | — |
| `AcopioDetalle` → `Saco` | 1 a N | Composición | — |
| `AcopioDetalle` → `Productor` / `Cultivo` | N a 1 | Asociación | — |
| `AcopioDetalle` → `Parcela` | N a 0..1 | Asociación | — |
| `Acopio` → `Recepcion` | 0..1 a N | Asociación | — |
| `Recepcion` → `RecepcionSaco` | 1 a N | Composición | — |
| `Receta` ↔ `OperacionProceso` | N a N | Asociación | `RecetaOperacion` |
| `Receta` → `OrdenProcesamiento` | 0..1 a N | Asociación | — |
| `OrdenProcesamiento` → `OrdenOperacion` / `OrdenSalida` / `OrdenRecepcion` | 1 a N | Composición | — |
| `OrdenOperacion` → `OperacionProceso` | N a 1 | Asociación | — |
| `OrdenProcesamiento` ↔ `Recepcion` | N a N | Asociación | `OrdenRecepcion` |
| `OrdenProcesamiento` → `OrdenProcesamiento` | 0..1 a 0..1 | Reflexiva (`orden_encadenada`) | — |
| `Kardex` → `KardexMovimiento` | 1 a N | Composición | — |
| `OrdenProcesamiento` ⇢ `Kardex` | 1 a N | **Dependencia** (al finalizar) | — |

---

## 3. Campos de auditoría compartidos

La mayoría de las entidades incluyen este bloque. Se omite en el diagrama para no duplicarlo:

| Campo | Tipo | Semántica |
|---|---|---|
| `created_at` | `DateTime @default(now())` | Alta |
| `updated_at` | `DateTime @updatedAt` | Última modificación |
| `activo` | `Boolean @default(true)` | **Soft delete** (borrado lógico) |
| `created_by` | `String(36) nullable` | FK lógica → `usuarios.id` |
| `updated_by` | `String(36) nullable` | FK lógica → `usuarios.id` |

**Entidades SIN este bloque:** `RefreshToken`, `ParcelaHistorial`, `RecepcionSaco`,
`OrdenSalida`, `OrdenRecepcion`, `Insumo`, `ManoDeObra`, `Maquinaria` (solo `created_at`/
`updated_at`), `RecetaOperacion`, `OrdenOperacion` (solo `created_at` implícito).

---

## 4. Enums del dominio

| Módulo | Enums |
|---|---|
| **Seguridad** | `Rol` (ADMIN, USER), `RolSic` (RESPONSABLE_SIC, INSPECTOR, COMITE_DECISION, TECNICO_CAMPO, ACOPIADOR, CAPACITADOR) |
| **Socios** | `Sexo`, `EstadoCivil`, `NivelEducativo`, `Idioma`, `EstadoProductor`, `CargoProductor`, `CategoriaDocumento`, `EstadoDocumento` |
| **Campo** | `CertificacionParcela`, `EstadoParcela`, `EstadoCultivo`, `MetodoSiembra`, `SistemaProductivo`, `TipoAgricultura`, `CertificacionCultivo`, `ProcedenciaSemilla`, `DestinoProduccion`, `EstadoCampania`, `TipoActividad`, `PrioridadActividad`, `EstadoActividad` |
| **Calidad** | `EstadoInspeccion`, `ResultadoInspeccion`, `CumplimientoCriterio`, `RiesgoNivel`, `SeveridadNoConformidad`, `EstadoNoConformidad`, `EstadoAccionCorrectiva` |
| **Operaciones** | `EstadoAcopio`, `EstadoProducto`, `EstadoRecepcion`, `CategoriaRecepcion`, `DestinoRecepcion`, `ResultadoRecepcion`, `EtapaProceso`, `EstadoOrden`, `TipoSalida`, `FormatoSalida`, `DestinoSalida`, `UnidadMedida`, `EstadoKardex`, `TipoMovimiento`, `OrigenKardex`, `CategoriaKardex`, `CalidadProducto` |
| **Procesamiento (legacy)** | `EstadoProcesamiento`, `TipoProceso`, `LineaProcesamiento` |

---

## 5. Notas de implementación

| # | Nota | Detalle |
|---|---|---|
| N-1 | **Fuente única** | El dominio vive en `packages/database/prisma/schema.prisma`; API, web y móvil lo consumen. |
| N-2 | **Convención de nombres** | BD/Prisma: `snake_case` (`orden_procesamiento`). Móvil: `camelCase` (`fechaInicio`, `campaniaId`) mediante `*ToBackend`/`*ToFrontend`. |
| N-3 | **Tipos numéricos** | Pesos: `Decimal(10,2)` o `Decimal(12,2)`; porcentajes: `Decimal(5,2)`; costos: `Decimal(10,2)`. |
| N-4 | **Identificadores** | `Int autoincrement` para la mayoría; `String uuid(36)` para `Usuario`, `RefreshToken`, `Insumo`, `ManoDeObra`, `Maquinaria` y `Saco`. |
| N-5 | **Restricciones de clave** | `codigo` es `@unique` en la mayoría de entidades de negocio; `dni` es `@unique` en `Productor`; `email` en `Usuario`; `jti` en `RefreshToken`; `ubigeo` en `Ubigeo`; `(tipo, nombre)` en `Catalogo`. |
| N-6 | **Legado** | El modelo `procesamiento` (y `EstadoProcesamiento`, `TipoProceso`, `LineaProcesamiento`) está **fuera del dominio vigente**; lo sustituye `orden_procesamiento` + `receta` + `operacion_proceso`. |
| N-7 | **Trazabilidad** | `kardex_movimiento.referencia_tipo` / `referencia_id` vinculan movimientos con órdenes, recepciones u otros orígenes. |
| N-8 | **Reglas no modeladas en clases** | Invariantes (`tara ≤ peso_bruto`, unicidad de código de saco, `fecha_fin > fecha_inicio`, `fecha_cosecha > fecha_siembra`) viven en los **validadores Joi**, no en las clases. |

---

**Siguiente paso ICONIX:** Parte 6 — **Matriz de Trazabilidad** (casos de uso ↔ clases ↔
robustez ↔ secuencia ↔ pantallas).

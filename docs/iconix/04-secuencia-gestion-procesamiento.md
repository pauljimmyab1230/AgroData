# Diagramas de Secuencia — Gestión de Órdenes de Procesamiento (ICONIX · Parte 4)

> Se derivan del análisis de robustez `03-robustez-gestion-procesamiento.md`.
> Cada objeto boundary/control/entity se convierte en un `participant`.
>
> **Rutas reales verificadas en `apps/api/src/app.ts`:** `/api/ordenes-procesamiento`,
> `/api/operaciones-proceso`, `/api/recetas`, `/api/recepciones`.
>
> **RN-OPS-0 (seguridad):** solo `DELETE /:id` exige `ADMIN`; el resto de escrituras es
> accesible a cualquier usuario autenticado.

**Caso de uso cubierto:** UC-19 *Gestionar órdenes de procesamiento*.

---

## 1. Participantes

| `participant` | Rol | Módulo |
|---|---|---|
| `Actor` | 👤 Usuario / Administrador | humano |
| `Pantalla` | 📱 `ProcesamientosScreen` / `ProcesamientoFormScreen` / `ProcesamientoDetailScreen` | móvil |
| `Servicio` | 📱 `ordenes.ts` | móvil |
| `API` | 🌐 `api.ts` (Axios + interceptor de refresh) | móvil |
| `Middleware` | 🔐 `adminMiddleware` (solo DELETE) | API |
| `Controlador` | ⚙️ `ordenes.controller.ts` | API |
| `Validador` | ✅ `ordenes.validator.ts` (Joi) | API |
| `Balance` | ✅ `ValidarBalance` (balance de masa) | API |
| `Kardex` | 📦 `RegistrarEnKardex` | API |
| `Prisma` | 🗄️ Prisma Client | API |
| `BD` | 🛢️ MySQL | base de datos |

---

## 2. UC-19.3 · Registrar orden de procesamiento (principal)

```mermaid
sequenceDiagram
    autonumber
    actor Actor as 👤 Usuario
    participant Pantalla as 📱 ProcesamientoFormScreen
    participant Servicio as 📱 ordenes.ts
    participant API as 🌐 api.ts (interceptor)
    participant Controlador as ⚙️ OrdenesController
    participant Validador as ✅ ValidarOrden (Joi)
    participant Prisma as 🗄️ Prisma Client
    participant BD as 🛢️ MySQL

    Actor->>Pantalla: Pulsa "Nueva orden"
    Pantalla->>Servicio: fetchRecetasActivas(etapa)
    Servicio->>API: GET /api/recetas/activas
    API-->>Servicio: 200 { data }
    Servicio-->>Pantalla: desplegable de recetas

    Pantalla->>Servicio: fetchOperacionesActivas()
    Servicio->>API: GET /api/operaciones-proceso/activas
    API-->>Servicio: 200 { data }
    Servicio-->>Pantalla: desplegable de operaciones

    Pantalla->>API: GET /api/recepciones?limit=200
    API-->>Pantalla: 200 { data }
    Pantalla-->>Actor: desplegable de recepciones

    Actor->>Pantalla: Ingresa planta, responsable, fecha_inicio, etapa, producto_salida
    Actor->>Pantalla: Selecciona receta (precarga operaciones)
    Actor->>Pantalla: Asigna recepciones con cantidad_asignada
    Actor->>Pantalla: Pulsa "Guardar"

    Pantalla->>Servicio: createOrden(OrdenInput)
    Servicio->>API: POST /api/ordenes-procesamiento<br/>{ planta, responsable, fecha_inicio, etapa,<br/>producto_salida, receta_id, operaciones:[], recepciones:[] }
    Note right of API: ⚠️ Sin adminMiddleware<br/>(RN-OPS-0)
    API->>Controlador: create(req, res)
    Controlador->>Validador: validate(createOrdenSchema)
    Validador->>Validador: valida obligatorios y enums

    alt falta planta, responsable, fecha_inicio, etapa o producto_salida
        Validador-->>Controlador: 400
        Controlador-->>API: 400
        API-->>Servicio: 400
        Servicio-->>Pantalla: error de validación
        Pantalla-->>Actor: Resalta campos inválidos
    end

    alt etapa fuera de PRIMARIA / SECUNDARIA / EMPAQUE
        Validador-->>Controlador: 400
        Controlador-->>API: 400
        API-->>Servicio: 400
        Servicio-->>Pantalla: error
        Pantalla-->>Actor: Corrige la etapa
    end

    alt cantidad_asignada no positiva
        Validador-->>Controlador: 400
        Controlador-->>API: 400
        API-->>Servicio: 400
        Servicio-->>Pantalla: error
        Pantalla-->>Actor: Corrige la cantidad
    end

    Controlador->>Prisma: ordenes.create(data + operaciones + recepciones)
    Prisma->>BD: BEGIN TX<br/>INSERT ordenes_procesamiento<br/>INSERT orden_operaciones<br/>INSERT orden_recepciones<br/>COMMIT
    BD-->>Prisma: ids
    Prisma-->>Controlador: Orden creada (estado BORRADOR)
    Controlador-->>API: 201 { success, data }
    API-->>Servicio: 201
    Servicio-->>Pantalla: orden persistida
    Pantalla-->>Actor: Vuelve a la lista
```

---

## 3. UC-19.4 · Registrar operación ejecutada y UC-19.5 · Salida pesada

```mermaid
sequenceDiagram
    autonumber
    actor Actor as 👤 Usuario
    participant Detalle as 📱 ProcesamientoDetailScreen
    participant Servicio as 📱 ordenes.ts
    participant API as 🌐 api.ts
    participant Controlador as ⚙️ OrdenesController
    participant Validador as ✅ ValidarOperacion / ValidarSalida
    participant Prisma as 🗄️ Prisma Client
    participant BD as 🛢️ MySQL

    rect rgba(227, 242, 253, 0.5)
        Note over Actor,BD: UC-19.4 · Operación ejecutada
        Actor->>Detalle: Pulsa "Registrar operación"
        Detalle->>Servicio: addOperacion(ordenId, OperacionEjecutadaInput)
        Servicio->>API: POST /api/ordenes-procesamiento/:id/operaciones<br/>{ operacion_id, orden, fecha, operario,<br/>peso_antes, peso_despues, humedad, resultado, completada }
        Note right of API: ⚠️ Sin adminMiddleware (RN-OPS-0)
        API->>Controlador: addOperacion(req, res)
        Controlador->>Validador: validate(createOperacionEjecutadaSchema)

        alt falta operacion_id
            Validador-->>Controlador: 400
            Controlador-->>API: 400
            API-->>Servicio: 400
            Servicio-->>Detalle: error
            Detalle-->>Actor: Corrige la operación
        end

        alt humedad fuera de 0–100 o peso negativo
            Validador-->>Controlador: 400
            Controlador-->>API: 400
            API-->>Servicio: 400
            Servicio-->>Detalle: error
            Detalle-->>Actor: Corrige los valores
        end

        Controlador->>Prisma: operacionesEjecutadas.create(data)
        Prisma->>BD: INSERT operaciones_ejecutadas
        BD-->>Prisma: id
        Prisma-->>Controlador: Operación registrada
        Controlador-->>API: 201 { success, data }
        API-->>Servicio: 201
        Servicio-->>Detalle: operación agregada
    end

    rect rgba(232, 245, 233, 0.5)
        Note over Actor,BD: UC-19.5 · Salida pesada
        Actor->>Detalle: Pulsa "Registrar salida"
        Detalle->>Servicio: addSalida(ordenId, SalidaInput)
        Servicio->>API: POST /api/ordenes-procesamiento/:id/salidas<br/>{ tipo_salida, descripcion, cantidad, unidad,<br/>humedad, destino, cuenta_en_balance }
        Note right of API: ⚠️ Sin adminMiddleware (RN-OPS-0)
        API->>Controlador: addSalida(req, res)
        Controlador->>Validador: validate(createSalidaSchema)

        alt falta tipo_salida, descripcion o cantidad no positiva
            Validador-->>Controlador: 400
            Controlador-->>API: 400
            API-->>Servicio: 400
            Servicio-->>Detalle: error
            Detalle-->>Actor: Corrige la salida
        end

        alt unidad fuera de KG / UNIDAD / LT
            Validador-->>Controlador: 400
            Controlador-->>API: 400
            API-->>Servicio: 400
            Servicio-->>Detalle: error
            Detalle-->>Actor: Corrige la unidad
        end

        Controlador->>Prisma: salidasPesadas.create(data)
        Prisma->>BD: INSERT salidas_pesadas
        BD-->>Prisma: id
        Prisma-->>Controlador: Salida registrada
        Controlador-->>API: 201 { success, data }
        API-->>Servicio: 201
        Servicio-->>Detalle: salida agregada
    end

    Note over Actor,BD: La edición usa PUT .../operaciones/:operacionOrdenId<br/>y PUT .../salidas/:salidaId; la eliminación usa DELETE
```

---

## 4. UC-19.6 · Finalizar orden (balance de masa + kardex)

```mermaid
sequenceDiagram
    autonumber
    actor Actor as 👤 Usuario
    participant Detalle as 📱 ProcesamientoDetailScreen
    participant Servicio as 📱 ordenes.ts
    participant API as 🌐 api.ts
    participant Controlador as ⚙️ OrdenesController
    participant Balance as ✅ ValidarBalance
    participant Kardex as 📦 RegistrarEnKardex
    participant Prisma as 🗄️ Prisma Client
    participant BD as 🛢️ MySQL

    Actor->>Detalle: Pulsa "Finalizar orden"
    Detalle->>Servicio: finalizarOrden(id)
    Servicio->>API: POST /api/ordenes-procesamiento/:id/finalizar
    Note right of API: ⚠️ Sin adminMiddleware (RN-OPS-0)
    API->>Controlador: finalizar(req, res)

    Controlador->>Balance: calcularYValidarBalance(ordenId)
    Balance->>Prisma: suma entradas (recepciones asignadas) y salidas
    Prisma->>BD: SELECT SUM por orden
    BD-->>Prisma: pesos
    Prisma-->>Balance: masa entrada / masa salida
    Balance->>Balance: compara entrada vs salida + merma

    alt balance de masa inconsistente
        Balance-->>Controlador: 400/409 (detalle del descuadre)
        Controlador-->>API: 400/409
        API-->>Servicio: error
        Servicio-->>Detalle: error de balance
        Detalle-->>Actor: Muestra el descuadre y exige corregir
    end

    Controlador->>Kardex: registrarEntrada(producto_salida, cantidad)
    Kardex->>Prisma: kardexItem.create / kardexMovimiento.create
    Prisma->>BD: INSERT kardex_items / kardex_movimientos
    BD-->>Prisma: ids
    Prisma-->>Kardex: entrada registrada
    Kardex-->>Controlador: ok

    Controlador->>Prisma: ordenes.update(estado = FINALIZADO)
    Prisma->>BD: UPDATE ordenes_procesamiento
    BD-->>Prisma: ok
    Prisma-->>Controlador: orden finalizada
    Controlador-->>API: 200 { success, data }
    API-->>Servicio: 200
    Servicio-->>Detalle: orden cerrada
    Detalle-->>Actor: Resumen del balance y del ingreso al kardex
```

---

## 5. UC-19.7 · Encadenar etapa y UC-19.8 · Eliminar orden

```mermaid
sequenceDiagram
    autonumber
    actor Actor as 👤 Usuario
    actor Admin as 👤 Administrador
    participant Detalle as 📱 ProcesamientoDetailScreen
    participant Servicio as 📱 ordenes.ts
    participant API as 🌐 api.ts
    participant Middleware as 🔐 adminMiddleware
    participant Controlador as ⚙️ OrdenesController
    participant Validador as ✅ ValidarOrden (Joi)
    participant Prisma as 🗄️ Prisma Client
    participant BD as 🛢️ MySQL

    rect rgba(232, 245, 233, 0.5)
        Note over Actor,BD: UC-19.7 · Encadenar etapa siguiente
        Actor->>Detalle: Pulsa "Encadenar etapa"
        Detalle->>Servicio: encadenarOrden(id, OrdenInput)
        Servicio->>API: POST /api/ordenes-procesamiento/:id/encadenar
        Note right of API: ⚠️ Sin adminMiddleware (RN-OPS-0)
        API->>Controlador: encadenar(req, res)
        Controlador->>Validador: validate(createOrdenSchema)
        Validador-->>Controlador: ok
        Controlador->>Prisma: ordenes.create(orden_origen_id = id)
        Prisma->>BD: INSERT ordenes_procesamiento
        BD-->>Prisma: id (nueva orden)
        Prisma-->>Controlador: Orden de la etapa siguiente creada
        Controlador-->>API: 201 { success, data }
        API-->>Servicio: 201
        Servicio-->>Detalle: nueva orden vinculada
        Detalle-->>Actor: Navega a la orden encadenada
    end

    rect rgba(255, 235, 238, 0.5)
        Note over Admin,BD: UC-19.8 · Eliminar orden (única con ADMIN)
        Admin->>Detalle: Pulsa "Eliminar orden"
        Detalle-->>Admin: Confirmación
        Admin->>Detalle: Confirma
        Detalle->>Servicio: deleteOrden(id)
        Servicio->>API: DELETE /api/ordenes-procesamiento/:id
        API->>Middleware: autenticar + autorizar
        Middleware->>Middleware: Verifica rol = ADMIN

        alt rol ≠ ADMIN
            Middleware-->>API: 403 Acceso denegado
            API-->>Servicio: 403
            Servicio-->>Detalle: error
            Detalle-->>Admin: "Acceso denegado"
        end

        Middleware->>Controlador: remove(req, res)
        Controlador->>Prisma: ordenes.delete(where id)
        Prisma->>BD: DELETE (cascade de operaciones y salidas)
        BD-->>Prisma: ok
        Prisma-->>Controlador: orden eliminada
        Controlador-->>API: 200 { success }
        API-->>Servicio: 200
        Servicio-->>Detalle: vuelve a la lista
        Detalle-->>Admin: Orden eliminada
    end
```

---

## 6. Verificación de robustez (hallazgos)

| # | Hallazgo durante la secuencia | ¿Afecta al caso de uso? | Acción |
|---|---|---|---|
| S-1 | `ordenes.ts` **sí** tiene capa de servicio (a diferencia de acopios) | Sí — arquitectura | Reflejado |
| S-2 | `OrdenInput`/`SalidaInput` se envían **sin transformación** (no hay `*ToBackend`) | Sí — contrato | Registrado |
| S-3 | **RN-OPS-0:** solo `DELETE /:id` pasa por `adminMiddleware` | Sí — seguridad | Marcado en cada diagrama |
| S-4 | `finalizar` **tiene efecto lateral** sobre el Kardex | Sí — acoplamiento UC-19↔UC-20 | Control `RegistrarEnKardex` |
| S-5 | El **balance de masa** se valida **solo al finalizar**, no al crear | Sí — regla de negocio | Reflejado en §4 |
| S-6 | `encadenar` crea una nueva orden con `orden_origen_id` (auto-referencia) | Sí — dominio | Reflejado en §5 |
| S-7 | Rutas reales: `/api/ordenes-procesamiento`, `/api/operaciones-proceso` | Corrige docs previos | Registrado |

> **Verificación ICONIX:** todos los mensajes tienen objeto de robustez asignado. Puede
> avanzarse a la **Parte 5 — Diagrama de Clases**.

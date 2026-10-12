# Diagramas de Casos de Uso — AgroData Móvil

> Gráficos Mermaid para la tesis. Se renderizan en `https://mermaid.live` (pegar el bloque)
> o en cualquier editor Markdown compatible (VS Code + extensión Mermaid, GitHub, Obsidian).
>
> **Nota de notación:** Mermaid no tiene un tipo nativo de *diagrama de casos de uso* UML; se
> emula con `flowchart` (actores = rectángulos; casos de uso = elipses/stadium; frontera del
> sistema = subgrafo). Es equivalente UML 2 y suficiente para la tesis.

Contenido:
1. [Caso de uso general](#1-caso-de-uso-general)
2. [Caso de uso de Producción Orgánica](#2-caso-de-uso-de-producción-orgánica)
3. [Caso de uso de Procesamiento](#3-caso-de-uso-de-procesamiento)
4. [Flujo de Trazabilidad](#4-flujo-de-trazabilidad)

---

## 1. Caso de uso general

Vista global de todos los módulos del sistema móvil y sus actores.

```mermaid
flowchart LR
    Usuario(["👤 Usuario<br/>ADMIN / USER"])
    Admin(["👤 Administrador<br/>(rol ADMIN)"])
    API["⚙️ API REST AgroData"]

    subgraph SIS["Sistema AgroData · App Móvil"]
        direction TB

        subgraph SEG["Seguridad"]
            uc1(["Iniciar sesión"])
            uc2(["Renovar sesión"])
            uc3(["Cerrar sesión"])
            uc4(["Ver perfil"])
        end

        subgraph SOC["Socios"]
            uc5(["Gestionar productores"])
            uc6(["Gestionar familiares"])
        end

        subgraph CAM["Campo"]
            uc7(["Gestionar campañas"])
            uc8(["Gestionar parcelas"])
            uc9(["Gestionar cultivos"])
            uc10(["Gestionar actividades"])
        end

        subgraph CAL["Calidad"]
            uc11(["Gestionar inspecciones"])
        end

        subgraph OPE["Operaciones"]
            uc12(["Gestionar acopios"])
            uc13(["Gestionar recepciones"])
            uc14(["Gestionar órdenes de procesamiento"])
            uc15(["Gestionar kardex"])
        end

        subgraph ADM["Administración"]
            uc16(["Gestionar usuarios"])
            uc17(["Gestionar catálogos"])
        end

        subgraph PAN["Panel"]
            uc18(["Ver panel de control"])
        end
    end

    Usuario --> uc1
    Usuario --> uc2
    Usuario --> uc3
    Usuario --> uc4
    Usuario --> uc5
    Usuario --> uc6
    Usuario --> uc7
    Usuario --> uc8
    Usuario --> uc9
    Usuario --> uc10
    Usuario --> uc11
    Usuario --> uc12
    Usuario --> uc13
    Usuario --> uc14
    Usuario --> uc18

    Admin --> uc5
    Admin --> uc6
    Admin --> uc7
    Admin --> uc8
    Admin --> uc9
    Admin --> uc10
    Admin --> uc11
    Admin --> uc12
    Admin --> uc13
    Admin --> uc15
    Admin --> uc16
    Admin --> uc17

    uc5 -.-> API
    uc8 -.-> API
    uc14 -.-> API
    uc15 -.-> API
```

---

## 2. Caso de uso de Producción Orgánica

Cubre la cadena de producción: **socios → parcelas → campañas → cultivos → actividades →
inspecciones → acopio**. Los actores primarios son el Usuario (lectura) y el Administrador
(escritura). Se marca con flechas punteadas la dependencia secuencial entre casos de uso.

```mermaid
flowchart TB
    Usuario(["👤 Usuario"])
    Admin(["👤 Administrador"])

    subgraph PROD["Producción Orgánica (App Móvil)"]
        direction TB

        subgraph SOC["Socios"]
            ucA(["Gestionar socios<br/>(productores y familiares)"])
        end

        subgraph CAMPO["Campo"]
            ucB(["Gestionar parcelas"])
            ucC(["Gestionar campañas"])
            ucD(["Gestionar cultivos"])
            ucE(["Gestionar actividades<br/>(insumos, mano de obra, maquinaria)"])
        end

        subgraph CALIDAD["Calidad"]
            ucF(["Gestionar inspecciones SIC<br/>(checklist, no conformidades)"])
        end

        subgraph ACOPIO["Operaciones"]
            ucG(["Gestionar acopio<br/>(detalles por productor y sacos)"])
        end
    end

    Usuario --> ucA
    Usuario --> ucB
    Usuario --> ucC
    Usuario --> ucD
    Usuario --> ucE
    Usuario --> ucF
    Usuario --> ucG

    Admin --> ucA
    Admin --> ucB
    Admin --> ucC
    Admin --> ucD
    Admin --> ucE
    Admin --> ucF
    Admin --> ucG

    ucA -. "requiere" .-> ucB
    ucB -. "se cultiva en" .-> ucD
    ucC -. "agrupa" .-> ucD
    ucD -. "ejecuta" .-> ucE
    ucD -. "se inspecciona" .-> ucF
    ucD -. "se acopia" .-> ucG
```

---

## 3. Caso de uso de Procesamiento

Cubre la transformación: **recepción → procesamiento (órdenes, recetas, operaciones, salidas)
→ kardex (inventario)**. La orden puede encadenarse entre etapas (PRIMARIA → SECUNDARIA →
EMPAQUE) y al finalizar da entrada al Kardex.

```mermaid
flowchart LR
    Usuario(["👤 Usuario"])
    Admin(["👤 Administrador"])

    subgraph PROC["Procesamiento (App Móvil)"]
        direction TB

        subgraph REC["Recepción"]
            ucR1(["Listar recepciones"])
            ucR2(["Registrar recepción<br/>(pesaje y control de calidad)"])
        end

        subgraph ORD["Procesamiento"]
            ucO1(["Registrar orden<br/>(receta + recepciones)"])
            ucO2(["Registrar operación ejecutada"])
            ucO3(["Registrar salida pesada"])
            ucO4(["Finalizar orden<br/>(valida balance de masa)"])
            ucO5(["Encadenar etapa<br/>PRIMARIA → SECUNDARIA → EMPAQUE"])
        end

        subgraph KDX["Kardex"]
            ucK1(["Ver inventario y alertas"])
            ucK2(["Registrar movimiento"])
            ucK3(["Dar de baja / recalcular stock"])
        end
    end

    Usuario --> ucR1
    Usuario --> ucO1
    Usuario --> ucO2
    Usuario --> ucO3
    Usuario --> ucO4
    Usuario --> ucO5
    Usuario --> ucK1

    Admin --> ucR2
    Admin --> ucK2
    Admin --> ucK3

    ucR2 -. "insumo de" .-> ucO1
    ucO1 -. "incluye" .-> ucO2
    ucO1 -. "produce" .-> ucO3
    ucO2 -. "concluye en" .-> ucO4
    ucO4 -. "da entrada a" .-> ucK1
    ucO4 -. "continúa con" .-> ucO5
    ucO5 -. "genera nueva" .-> ucO1
```

---

## 4. Flujo de Trazabilidad

Cadena de trazabilidad del producto, desde el **productor** hasta el **producto final**,
pasando por los eslabones que el sistema registra. Cada nodo indica el recurso/API donde se
recupera la información.

```mermaid
flowchart LR
    P(["Productor<br/>(socio)"]) --> A(["Parcela<br/>georreferenciada"])
    A --> C(["Cultivo<br/>(campaña + parcela)"])
    C --> B(["Acopio<br/>sacos por productor"])
    B --> R(["Recepción<br/>pesaje + control de calidad"])
    R --> O(["Orden de Procesamiento<br/>etapas + operaciones + salidas"])
    O --> K(["Kardex<br/>inventario de producto"])
    O -. "encadena etapa" .-> O2(["Orden etapa siguiente<br/>SECUNDARIA / EMPAQUE"])
    O2 --> K
    K --> F(["Producto final<br/>trazable"])

    B -. "buscar por código" .-> BAPI["GET /api/acopios/buscar/:codigo"]
    O -. "trazabilidad" .-> OAPI["GET /api/ordenes/:id/trazabilidad"]
    O -. "balance" .-> OAPI2["GET /api/ordenes/:id/balance"]

    classDef origen fill:#e8f5e9,stroke:#2e7d32;
    classDef proceso fill:#e3f2fd,stroke:#1565c0;
    classDef final fill:#fff3e0,stroke:#ef6c00;
    class P,A,C origen
    class B,R,O,O2,K proceso
    class F final
```

> **Lectura del diagrama:** la cadena `Productor → Parcela → Cultivo` representa el origen
> agrícola; `Acopio → Recepción → Procesamiento → Kardex` representa la transformación y el
> inventario; los nodos punteados muestran los puntos de consulta de trazabilidad expuestos
> por el API (`/trazabilidad`, `/balance`, `/buscar/:codigo`).

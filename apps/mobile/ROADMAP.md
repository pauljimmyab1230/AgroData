# 📋 ROADMAP - AgroData Mobile

> Plan de desarrollo completo para la app móvil (React Native / Expo SDK 57)

---

## 📊 Estado Actual

| Módulo | Create | Read | Update | Delete | Estado |
|--------|:------:|:----:|:------:|:------:|:------:|
| Auth/Login | — | ✅ | — | ✅ | ✅ Completo |
| Dashboard | — | ✅ | — | — | ✅ Solo lectura |
| Productores | ✅ | ✅ | ✅ | ✅ | ✅ CRUD completo |
| Familiares | ✅ | ✅ | ✅ | ✅ | ✅ CRUD completo |
| Parcelas | ✅ | ✅ | ✅ | ✅ | ✅ CRUD completo |
| Campañas | ✅ | ✅ | ✅ | ✅ | ✅ CRUD completo |
| Cultivos | ✅ | ✅ | ✅ | ✅ | ✅ CRUD completo |
| Actividades | — | — | — | — | ❌ No existe |
| Inspecciones | — | — | — | — | ❌ No existe |
| Acopio | — | — | — | — | ❌ No existe |
| Recepción | — | — | — | — | ❌ No existe |
| Procesamiento | — | — | — | — | ❌ No existe |
| Kardex | — | — | — | — | ❌ No existe |
| Usuarios | — | — | — | — | ❌ No existe |
| Catálogos | — | — | — | — | ❌ No existe |

**Cobertura actual: 7 de 14 módulos (50%)**

---

## 🗂️ Estructura de Archivos

```
apps/mobile/src/
├── App.tsx                              # Entry: Auth gate + NavigationContainer
├── index.ts                             # registerRootComponent
│
├── navigation/
│   ├── AppNavigator.tsx                 # Bottom Tabs (Dashboard, Socios, Campo)
│   └── AppStacks.tsx                    # Stack navigators por módulo
│
├── screens/
│   ├── LoginScreen.tsx                  # ✅ Login
│   ├── DashboardScreen.tsx              # ✅ Dashboard
│   │
│   ├── ProductoresScreen.tsx            # ✅ Lista productores
│   ├── ProductorDetailScreen.tsx        # ✅ Detalle productor
│   ├── ProductorCreateScreen.tsx        # ✅ Crear productor
│   ├── ProductorEditScreen.tsx          # ✅ Editar/Eliminar productor
│   ├── FamiliaresScreen.tsx             # ✅ Lista familiares
│   ├── FamiliarCreateScreen.tsx         # ✅ Crear familiar
│   ├── FamiliarEditScreen.tsx           # ✅ Editar/Eliminar familiar
│   │
│   ├── CampoScreen.tsx                  # ✅ Menú de campo
│   ├── ParcelasScreen.tsx               # ✅ Lista parcelas
│   ├── ParcelaDetailScreen.tsx          # ✅ Detalle parcela
│   ├── ParcelaFormScreen.tsx            # ✅ Crear/Editar/Eliminar parcela
│   ├── CampaniasScreen.tsx              # ✅ Lista campañas
│   ├── CampaniaDetailScreen.tsx         # ✅ Detalle campaña
│   ├── CampaniaFormScreen.tsx           # ✅ Crear/Editar/Eliminar campaña
│   ├── CultivosScreen.tsx               # ✅ Lista cultivos
│   ├── CultivoDetailScreen.tsx          # ✅ Detalle cultivo
│   ├── CultivoFormScreen.tsx            # ✅ Crear/Editar/Eliminar cultivo
│   │
│   ├── ActividadesScreen.tsx            # ❌ POR CREAR
│   ├── ActividadDetailScreen.tsx        # ❌ POR CREAR
│   ├── ActividadFormScreen.tsx          # ❌ POR CREAR
│   ├── InspeccionesScreen.tsx           # ❌ POR CREAR
│   ├── InspeccionDetailScreen.tsx       # ❌ POR CREAR
│   ├── InspeccionFormScreen.tsx         # ❌ POR CREAR
│   ├── AcopioScreen.tsx                 # ❌ POR CREAR
│   ├── AcopioDetailScreen.tsx           # ❌ POR CREAR
│   ├── AcopioFormScreen.tsx             # ❌ POR CREAR
│   ├── RecepcionScreen.tsx              # ❌ POR CREAR
│   ├── RecepcionDetailScreen.tsx        # ❌ POR CREAR
│   ├── RecepcionFormScreen.tsx          # ❌ POR CREAR
│   ├── ProcesamientoScreen.tsx          # ❌ POR CREAR
│   ├── ProcesamientoDetailScreen.tsx    # ❌ POR CREAR
│   ├── ProcesamientoFormScreen.tsx      # ❌ POR CREAR
│   ├── KardexScreen.tsx                 # ❌ POR CREAR
│   ├── KardexDetailScreen.tsx           # ❌ POR CREAR
│   ├── KardexFormScreen.tsx             # ❌ POR CREAR
│   ├── UsuariosScreen.tsx               # ❌ POR CREAR
│   ├── UsuarioDetailScreen.tsx          # ❌ POR CREAR
│   ├── UsuarioFormScreen.tsx            # ❌ POR CREAR
│   └── CatalogoScreen.tsx               # ❌ POR CREAR
│
├── services/
│   ├── api.ts                           # ✅ Axios + auth interceptor
│   ├── auth.ts                          # ✅ Login, profile, logout
│   ├── dashboard.ts                     # ✅ Stats aggregation
│   ├── productores.ts                   # ✅ CRUD Productores + Familiares
│   ├── campo.ts                         # ✅ CRUD Parcelas, Campañas, Cultivos
│   ├── actividades.ts                   # ❌ POR CREAR
│   ├── inspecciones.ts                  # ❌ POR CREAR
│   ├── acopios.ts                       # ❌ POR CREAR
│   ├── recepciones.ts                   # ❌ POR CREAR
│   ├── procesamientos.ts                # ❌ POR CREAR
│   ├── kardex.ts                        # ❌ POR CREAR
│   ├── usuarios.ts                      # ❌ POR CREAR
│   └── catalogos.ts                     # ❌ POR CREAR
│
├── hooks/
│   ├── useDashboard.ts                  # ✅
│   ├── useProductores.ts                # ✅
│   ├── useCampo.ts                      # ✅
│   ├── useActividades.ts                # ❌ POR CREAR
│   ├── useInspecciones.ts               # ❌ POR CREAR
│   ├── useOperaciones.ts                # ❌ POR CREAR (acopio, recepcion, procesamiento, kardex)
│   └── useAdmin.ts                      # ❌ POR CREAR (usuarios, catalogos)
│
├── components/ui/
│   ├── Card.tsx                         # ✅
│   ├── Badge.tsx                        # ✅
│   ├── StatCard.tsx                     # ✅
│   ├── SearchInput.tsx                  # ✅
│   ├── LoadingSpinner.tsx               # �p
│   ├── EmptyState.tsx                   # ✅
│   ├── SelectField.tsx                  # ❌ POR CREAR (reutilizable)
│   ├── FormField.tsx                    # ❌ POR CREAR (reutilizable)
│   ├── ConfirmDialog.tsx                # ❌ POR CREAR (reutilizable)
│   └── index.ts                         # ✅
│
└── utils/
    └── platform.ts                      # ✅
```

---

## 🧭 Navegación - Rutas

### Bottom Tabs (AppNavigator)

```
┌─────────────────────────────────────────┐
│              Bottom Tabs                │
├───────────┬───────────┬─────────────────┤
│ Dashboard │  Socios   │     Campo       │
│  (icon)   │  (icon)   │     (icon)      │
└───────────┴───────────┴─────────────────┘
```

### Stack: Dashboard
```
DashboardMain → DashboardScreen
```

### Stack: Socios
```
ProductoresMain → ProductorCreate
               → ProductorDetail → ProductorEdit
                                 → Familiares → FamiliarCreate
                                              → FamiliarEdit
```

### Stack: Campo
```
CampoMain → Parcelas → ParcelaDetail → ParcelaForm
         → Campanias → CampaniaDetail → CampaniaForm
         → Cultivos → CultivoDetail → CultivoForm
         → Actividades → ActividadDetail → ActividadForm     ❌ NUEVO
         → Inspecciones → InspeccionDetail → InspeccionForm  ❌ NUEVO
```

### Stack: Operaciones (NUEVO TAB o submenú)
```
OperacionesMain → Acopio → AcopioDetail → AcopioForm
                → Recepcion → RecepcionDetail → RecepcionForm
                → Procesamiento → ProcesamientoDetail → ProcesamientoForm
                → Kardex → KardexDetail → KardexForm
```

### Stack: Configuración (NUEVO TAB o submenú)
```
ConfigMain → Usuarios → UsuarioDetail → UsuarioForm
           → CatalogoScreen (genérico por tipo)
```

---

## 📱 Contenido de Cada Pantalla

### LoginScreen
- Logo de AgroData
- Campo: Correo electrónico
- Campo: Contraseña
- Botón: Iniciar Sesión
- Guarda token en AsyncStorage

### DashboardScreen
- 4 StatCards: Productores, Parcelas, Cultivos, Campañas
- Lista de actividades recientes
- Card de campaña actual (destacada)

### ProductoresScreen
- Header con botón "+ Nuevo"
- 4 KPIs: Total, Activos, Mujeres, Varones
- SearchInput
- FlatList de productores con avatar, nombre, código, comunidad, badge estado
- Tap → ProductorDetail

### ProductorDetailScreen
- Avatar grande + nombre + código + badge estado
- Botón "Editar Productor"
- Card: Datos Personales (DNI, sexo, nacimiento, etc.)
- Card: Contacto (teléfono, correo)
- Card: Ubicación (dpto, prov, distrito, comunidad)
- Card: Info Adicional (organización, fecha ingreso)
- Botón "Ver Familiares" → FamiliaresScreen

### ProductorCreateScreen / ProductorEditScreen
- Header con botón ← y Guardar
- Sección: Datos Personales (DNI, nombres, apellidos, sexo, nacimiento, estado civil)
- Sección: Contacto (teléfono, correo)
- Sección: Ubicación (dpto, prov, distrito, comunidad, dirección)
- Sección: Info Adicional (nivel educativo, idioma, organización, estado)
- Edit: Botón "Eliminar Productor" al fondo

### FamiliaresScreen
- Header con nombre del productor y botón +
- FlatList de familiares con nombre, parentesco, badges
- Tap → FamiliarEdit
- Botón 🗑️ para eliminar

### FamiliarCreateScreen / FamiliarEditScreen
- Header con botón ← y Guardar
- Sección: Datos (nombre, parentesco, DNI, sexo, nacimiento, ocupación, nivel educativo, teléfono)
- Sección: Condición (switches: dependiente, vive con productor)
- Edit: Botón "Eliminar Familiar" al fondo

### CampoScreen (Menú)
- 3 tarjetas navigables: Parcelas, Campañas, Cultivos
- FUTURO: Agregar Actividades e Inspecciones

### ParcelasScreen
- Header con botón "+ Nueva"
- SearchInput
- FlatList de parcelas con icono, nombre, código, hectáreas, badge estado
- Tap → ParcelaDetail

### ParcelaDetailScreen
- Header con nombre + código + badge
- Botón "Editar Parcela"
- Card: Info General (hectáreas, suelo, agua, riego, zona)
- Card: Ubicación (dpto, prov, dist, comunidad, coordenadas, altitud)
- Card: Productor (si tiene)

### ParcelaFormScreen
- Header con botón ← y Guardar
- Sección: Info General (nombre, código, hectáreas, estado)
- Sección: Suelo y Agua (tipo suelo, fuente agua, riego, zona)
- Sección: Ubicación (dpto, prov, dist, comunidad)
- Sección: Coordenadas (lat, lng, altitud)
- Edit: Botón "Eliminar Parcela"

### CampaniasScreen / CampaniaDetailScreen / CampaniaFormScreen
- Mismo patrón que Parcelas pero con: nombre, código, año agrícola, fecha inicio/fin, estado, descripción

### CultivosScreen / CultivoDetailScreen / CultivoFormScreen
- Mismo patrón que Parcelas pero con: nombre, código, variedad, superficie, fecha siembra/cosecha, estado, parcela, campaña

---

## 🚀 Roadmap de Desarrollo

### Fase 1: Completar (HECHO) ✅
- [x] Auth: Login + token management
- [x] Dashboard con stats + error handling + pull-to-refresh
- [x] Productores CRUD completo (con `productorToFrontend()`)
- [x] Familiares CRUD completo
- [x] Parcelas CRUD completo
- [x] Campañas CRUD completo
- [x] Cultivos CRUD completo
- [x] Componente `SelectField` reutilizable
- [x] Componente `InfoRow` reutilizable
- [x] Constantes compartidas (`constants/options.ts`)
- [x] Config de API (`config.ts`)
- [x] Sistema de eventos (logout global)
- [x] AbortController en todos los hooks
- [x] Error handling en hooks y pantallas
- [x] SplashScreen preventAutoHideAsync

### Fase 2: Actividades e Inspecciones (CAMPO) - Pendiente
- [ ] Servicio `actividades.ts` (API: GET, POST, PUT, DELETE `/actividades`)
- [ ] Servicio `inspecciones.ts` (API: GET, POST, PUT, DELETE `/inspecciones`)
- [ ] Hook `useActividades.ts`
- [ ] Hook `useInspecciones.ts`
- [ ] `ActividadesScreen.tsx` - Lista con filtros por campaña/parcela
- [ ] `ActividadDetailScreen.tsx` - Detalle con insumos, mano de obra, maquinaria
- [ ] `ActividadFormScreen.tsx` - Crear/Editar actividad
- [ ] `InspeccionesScreen.tsx` - Lista con filtros
- [ ] `InspeccionDetailScreen.tsx` - Detalle con checklist, no conformidades
- [ ] `InspeccionFormScreen.tsx` - Crear/Editar inspección
- [ ] Actualizar `CampoScreen.tsx` - Agregar Actividades e Inspecciones al menú
- [ ] Actualizar `AppStacks.tsx` - Agregar rutas

### Fase 3: Operaciones - Pendiente
- [ ] Servicio `acopios.ts` (API: GET, POST, PUT, DELETE + stats + buscar)
- [ ] Servicio `recepciones.ts` (API: GET, POST, PUT, DELETE)
- [ ] Servicio `procesamientos.ts` (API: GET, POST, PUT, DELETE)
- [ ] Servicio `kardex.ts` (API: GET, POST, PUT, DELETE + movimientos)
- [ ] Hooks para cada módulo
- [ ] Pantallas CRUD para cada módulo (3 pantallas × 4 módulos = 12 pantallas)
- [ ] Nuevo tab "Operaciones" en AppNavigator o submenú en Campo

### Fase 4: Administración - Pendiente
- [ ] Servicio `usuarios.ts` (API: GET, POST, PUT, DELETE)
- [ ] Servicio `catalogos.ts` (API: GET por tipo, POST, PUT, DELETE)
- [ ] Pantallas CRUD de Usuarios (3 pantallas)
- [ ] Pantalla genérica de Catálogos (1 pantalla que carga por tipo)
- [ ] Nuevo tab "Configuración" o acceso desde perfil

### Fase 5: Mejoras y Optimización - Pendiente
- [ ] Componente `FormField.tsx` reutilizable
- [ ] Componente `ConfirmDialog.tsx` reutilizable
- [ ] Offline: caché de datos con AsyncStorage
- [ ] Push notifications
- [ ] Cámara para fotos de parcelas/evidencias
- [ ] GPS para geolocalización de actividades
- [ ] Exportar datos a CSV desde móvil
- [ ] Performance: implementar React Query en vez de hooks custom

---

## 📡 API Endpoints Disponibles

### Auth
- `POST /api/auth/login` (rate-limited)
- `POST /api/auth/register`
- `GET /api/auth/profile`

### Productores
- `GET /api/productores` (con filtros: search, estado, cargo, sexo, comunidad, page, limit)
- `GET /api/productores/stats`
- `GET /api/productores/comunidades`
- `GET /api/productores/:id`
- `POST /api/productores`
- `PUT /api/productores/:id`
- `DELETE /api/productores/:id`
- `GET/POST /api/productores/:id/familiares`
- `PUT/DELETE /api/productores/:id/familiares/:fid`
- `GET/POST /api/productores/:id/documentos`
- `PUT/DELETE /api/productores/:id/documentos/:did`

### Parcelas
- `GET /api/parcelas` (con filtros)
- `GET /api/parcelas/stats`
- `GET /api/parcelas/:id`
- `GET /api/parcelas/:id/historial`
- `POST/PUT/DELETE /api/parcelas/:id`
- `GET/POST/PUT/DELETE /api/parcelas/:id/documentos`
- `GET/POST/PUT/DELETE /api/parcelas/:id/fotos`

### Campañas
- `GET /api/campanias` (con filtros)
- `GET /api/campanias/stats`
- `GET /api/campanias/:id`
- `GET /api/campanias/:id/stats`
- `GET /api/campanias/:id/timeline`
- `POST/PATCH/DELETE /api/campanias/:id`

### Cultivos
- `GET /api/cultivos` (con filtros)
- `GET /api/cultivos/stats`
- `GET /api/cultivos/:id`
- `POST/PUT/DELETE /api/cultivos/:id`

### Actividades
- `GET /api/actividades` (con filtros)
- `GET /api/actividades/:id`
- `POST/PUT/DELETE /api/actividades/:id`

### Inspecciones
- `GET /api/inspecciones` (con filtros)
- `GET /api/inspecciones/:id`
- `POST/PUT/DELETE /api/inspecciones/:id`

### Acopio
- `GET /api/acopios` (con filtros)
- `GET /api/acopios/stats`
- `GET /api/acopios/buscar/:codigo`
- `GET /api/acopios/:id`
- `POST/PUT/DELETE /api/acopios/:id`

### Recepción
- `GET /api/recepcion` (con filtros)
- `GET /api/recepcion/:id`
- `POST/PUT/DELETE /api/recepcion/:id`

### Procesamiento
- `GET /api/procesamiento` (con filtros)
- `GET /api/procesamiento/:id`
- `POST/PUT/DELETE /api/procesamiento/:id`

### Kardex
- `GET /api/kardex` (con filtros)
- `GET /api/kardex/:id`
- `POST/PUT/DELETE /api/kardex/:id`
- `GET/POST /api/kardex/:id/movimientos`
- `DELETE /api/kardex/:id/movimientos/:mid`
- `POST /api/kardex/:id/recompute`

### Usuarios
- `GET /api/usuarios` (con filtros)
- `GET /api/usuarios/basic`
- `GET /api/usuarios/:id`
- `POST/PUT/DELETE /api/usuarios/:id`

### Catálogos
- `GET /api/catalogos/:tipo`
- `GET /api/catalogos/:tipo/activos`
- `POST /api/catalogos/:tipo`
- `PUT/PATCH/DELETE /api/catalogos/item/:id`

---

## 🏗️ Conventions

### Naming
- Screens: `ModuleNameScreen.tsx` (lista), `ModuleNameDetailScreen.tsx` (detalle), `ModuleNameFormScreen.tsx` (crear/editar)
- Services: `moduleName.ts` (uno por dominio)
- Hooks: `useModuleName.ts` (uno por dominio)
- Routes: PascalCase sin sufijo (ej: `Actividades`, `ActividadDetail`, `ActividadForm`

### Patterns
- Cada screen usa `StyleSheet.create()` (no Tailwind/NativeWind)
- Navegación: `useNavigation<any>()` y `useRoute<any>()`
- Datos: hooks custom con `useState` + `useEffect` + `useCallback`
- API: servicios con `axios` mapeando snake_case → camelCase
- Componentes UI: reutilizables en `components/ui/`
- Formularios: `KeyboardAvoidingView` + `ScrollView`

### API URL
- Desarrollo: `http://localhost:5000/api`
- Token: `AsyncStorage` key `agrodata-auth`

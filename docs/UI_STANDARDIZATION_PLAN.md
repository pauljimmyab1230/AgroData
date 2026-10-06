# Plan de Estandarización UI/UX - AgroData Mobile

## Objetivo
Unificar la interfaz de las 30 pantallas de la app móvil React Native/Expo, eliminando duplicación de estilos e inconsistencias, mediante:
- Design tokens centralizados
- Plantillas de pantalla reutilizables
- Componentes UI consistentes
- Dark mode completo en todas las pantallas

---

## Fase 1: Design Tokens Centralizados

### 1.1 Crear `apps/mobile/src/theme/tokens.ts`
Archivo único de verdad para todos los valores de diseño:

```typescript
export const tokens = {
  colors: {
    // Backgrounds
    background: { light: "#F9FAFB", dark: "#111827" },
    surface: { light: "#FFFFFF", dark: "#1F2937" },
    surfaceElevated: { light: "#FFFFFF", dark: "#283548" },

    // Primary
    primary: { light: "#166534", dark: "#22C55E" },
    primaryLight: { light: "#DCFCE7", dark: "#064E3B" },
    primarySurface: { light: "#ECFDF5", dark: "#022C22" },

    // Semantic
    success: { light: "#16A34A", dark: "#4ADE80" },
    warning: { light: "#D97706", dark: "#FBBF24" },
    error: { light: "#DC2626", dark: "#F87171" },
    info: { light: "#2563EB", dark: "#60A5FA" },

    // Text
    text: { light: "#111827", dark: "#F9FAFB" },
    textSecondary: { light: "#6B7280", dark: "#9CA3AF" },
    textMuted: { light: "#9CA3AF", dark: "#6B7280" },
    textInverse: { light: "#FFFFFF", dark: "#111827" },

    // Borders
    border: { light: "#E5E7EB", dark: "#374151" },
    borderLight: { light: "#F3F4F6", dark: "#1F2937" },
    divider: { light: "#F3F4F6", dark: "#374151" },

    // Interactive
    placeholder: { light: "#9CA3AF", dark: "#6B7280" },
    disabled: { light: "#D1D5DB", dark: "#4B5563" },
  },

  typography: {
    fontFamily: { regular: "System", medium: "System", semibold: "System", bold: "System" },
    size: {
      xs: 10, sm: 11, base: 12, md: 13, lg: 14, xl: 15, xxl: 16,
      title: 20, hero: 24, display: 32,
    },
    weight: { regular: "400", medium: "500", semibold: "600", bold: "700" },
    lineHeight: { tight: 1.2, normal: 1.4, relaxed: 1.6 },
  },

  spacing: {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
  },

  borderRadius: {
    sm: 8, md: 10, lg: 12, xl: 14, xxl: 16, full: 999,
  },

  shadow: {
    sm: { shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
    md: { shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    lg: { shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  },
};
```

### 1.2 Crear `apps/mobile/src/theme/index.ts`
Helper para resolver tokens según dark/light mode:

```typescript
export function useColors() {
  const { isDarkMode } = useTheme();
  const mode = isDarkMode ? "dark" : "light";
  return resolveColors(mode);
}
```

---

## Fase 2: Actualizar ThemeContext

### 2.1 Modificar `apps/mobile/src/contexts/ThemeContext.tsx`
- Expandir la interfaz `colors` para incluir todos los tokens del sistema
- Mantener retrocompatibilidad con las propiedades actuales (`background`, `surface`, `text`, `textSecondary`, `border`, `primary`)
- Agregar: `primaryLight`, `success`, `warning`, `error`, `info`, `textMuted`, `borderLight`, `divider`, `placeholder`, `disabled`, `surfaceElevated`

---

## Fase 3: Plantillas de Pantalla Reutilizables

### 3.1 `apps/mobile/src/components/layouts/ListScreenLayout.tsx`
Patrón para pantallas de listado (Productores, Parcelas, Campanias, Cultivos, Inspecciones, Actividades, Acopios, Recepciones, Familiares):

Props:
- `title: string` - Título de la pantalla
- `subtitle: string` - Subtítulo
- `onAdd?: () => void` - Acción del botón "Nuevo"
- `addButtonLabel?: string` - Texto del botón (default: "Nuevo")
- `kpis?: KpiItem[]` - Stats KPIs opcionales
- `searchPlaceholder?: string`
- `searchValue: string`
- `onSearchChange: (v: string) => void`
- `resultCount: number`
- `resultLabel?: string` - Label del conteo (default: "resultados")
- `isSearching?: boolean`
- `data: any[]`
- `renderItem: (item) => ReactElement`
- `keyExtractor: (item) => string`
- `onRefresh: () => void`
- `refreshing: boolean`
- `emptyTitle: string`
- `emptyDescription: string`
- `onEndReached?: () => void`
- `ListFooterComponent?: ReactElement`
- `header?: ReactElement` - CustomHeader opcional

Internamente maneja:
- SafeAreaView con fondo del tema
- CustomHeader condicional
- Sección de título + botón agregar
- Grid de KPIs (StatCard)
- SearchInput
- Result count row
- FlatList con ItemSeparatorComponent
- EmptyState
- Pull-to-refresh
- Bottom padding para tab bar (120px)

### 3.2 `apps/mobile/src/components/layouts/DetailScreenLayout.tsx`
Patrón para pantallas de detalle (ParcelaDetail, CampaniaDetail, CultivoDetail, InspeccionDetail, ActividadDetail, AcopioDetail, RecepcionDetail, ProductorDetail):

Props:
- `title: string`
- `subtitle?: string` (código)
- `icon?: { char: string; bg: string; color: string }`
- `badge?: { label: string; variant: string }`
- `kpis?: { icon: LucideIcon; label: string; value: string }[]`
- `sections: DetailSection[]` - Array de secciones con título + contenido
- `actions?: DetailAction[]` - Botones de acción (editar, eliminar)
- `map?: { latitud: number | null; longitud: number | null }`
- `children?: ReactElement` - Contenido adicional

### 3.3 `apps/mobile/src/components/layouts/FormScreenLayout.tsx`
Patrón para pantallas de formulario (ParcelaForm, CampaniaForm, CultivoForm, InspeccionForm, ActividadForm, AcopioForm, RecepcionForm, ProductorCreate, ProductorEdit):

Props:
- `title: string`
- `isEdit?: boolean`
- `steps?: string[]` - Nombres de pasos (si es multi-step)
- `currentStep?: number`
- `onStepChange?: (step: number) => void`
- `onBack: () => void`
- `onSave: () => void`
- `onDelete?: () => void`
- `saving?: boolean`
- `children: ReactElement` - Contenido del formulario

Internamente maneja:
- Header con botón retroceso + título
- Stepper visual (si steps > 0)
- KeyboardAvoidingView
- ScrollView
- Footer fijo con botones Anterior/Siguiente/Guardar
- Botón eliminar (si onDelete en modo edición)

### 3.4 `apps/mobile/src/components/layouts/MenuScreenLayout.tsx`
Patrón para pantallas de menú/hub (CampoScreen, OperacionesScreen):

Props:
- `title?: string` (no necesario si usa CustomHeader)
- `quickActions?: MenuItem[]` - Accesos rápidos
- `menuItems: MenuItem[]` - Items del menú principal
- `header?: ReactElement` - CustomHeader

---

## Fase 4: Componentes UI Actualizados

### 4.1 Actualizar componentes existentes en `apps/mobile/src/components/ui/`
Cada componente recibe `useColors()` y usa tokens del tema en lugar de hex hardcoded:

| Componente | Cambios |
|---|---|
| `Card.tsx` | Usar `colors.surface`, `borderRadius.xl`, `shadow.md` |
| `Badge.tsx` | Mapear variantes a tokens de color del tema |
| `StatCard.tsx` | Usar `colors.surface`, `colors.text`, `colors.textSecondary` |
| `SearchInput.tsx` | Usar `colors.surface`, `colors.border`, `colors.placeholder` |
| `EmptyState.tsx` | Usar `colors.textSecondary`, `colors.textMuted` |
| `InfoRow.tsx` | Usar `colors.text`, `colors.textSecondary`, `colors.divider` |
| `LoadingSpinner.tsx` | Usar `colors.primary` |
| `CustomHeader.tsx` | Usar `colors.surface`, `colors.text`, `colors.primary` |
| `SelectField.tsx` | Usar tokens de input/border/text |
| `DatePickerField.tsx` | Usar tokens de input/border/text |

### 4.2 Crear `apps/mobile/src/components/ui/SectionHeader.tsx`
Componente reutilizable para títulos de sección con icono:

```typescript
interface SectionHeaderProps {
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
}
```

### 4.3 Crear `apps/mobile/src/components/ui/KpiGrid.tsx`
Grid de KPIs reutilizable (reemplaza la duplicación del grid 2x2):

```typescript
interface KpiGridProps {
  items: { label: string; value: string; hint?: string; icon: LucideIcon; color: string; bg: string }[];
  columns?: 2 | 3;
}
```

### 4.4 Crear `apps/mobile/src/components/ui/PageHeader.tsx`
Header de página con título, subtítulo y botón de acción:

```typescript
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void; icon?: LucideIcon };
}
```

---

## Fase 5: Utilidades Compartidas

### 5.1 Crear `apps/mobile/src/utils/statusConfig.ts`
Configuración centralizada de colores de estado:

```typescript
export const STATUS_COLORS: Record<string, { color: string; bg: string; label: string }> = {
  ACTIVO: { color: "#16A34A", bg: "#DCFCE7", label: "Activo" },
  INACTIVO: { color: "#6B7280", bg: "#F3F4F6", label: "Inactivo" },
  SUSPENDIDO: { color: "#D97706", bg: "#FEF3C7", label: "Suspendido" },
  ACTIVA: { color: "#16A34A", bg: "#DCFCE7", label: "Activa" },
  INACTIVA: { color: "#6B7280", bg: "#F3F4F6", label: "Inactiva" },
  COMPLETADA: { color: "#16A34A", bg: "#DCFCE7", label: "Completada" },
  PENDIENTE: { color: "#D97706", bg: "#FEF3C7", label: "Pendiente" },
  CANCELADA: { color: "#DC2626", bg: "#FEE2E2", label: "Cancelada" },
  EN_PROCESO: { color: "#2563EB", bg: "#DBEAFE", label: "En Proceso" },
  PLANIFICADA: { color: "#6366F1", bg: "#EEF2FF", label: "Planificada" },
};
```

### 5.2 Crear `apps/mobile/src/hooks/useLogout.ts`
Hook compartido para manejo de logout (elimina duplicación en 6+ pantallas):

```typescript
export function useLogout() {
  const handleLogout = useCallback(() => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar Sesión", style: "destructive", onPress: async () => {
        await logout();
        const { emit } = require("../events");
        emit("LOGOUT");
      }},
    ]);
  }, []);
  return handleLogout;
}
```

### 5.3 Verificar que `apps/mobile/src/hooks/useDebounce.ts` existe
Si no existe, crearlo. Luego eliminar las definiciones inline de `useDebounce` de todas las pantallas (ParcelasScreen, CampaniasScreen, AcopiosScreen, InspeccionesScreen, ActividadesScreen).

---

## Fase 6: Refactorización de Pantallas

### 6.1 Pantallas de Listado (8 pantallas)
Migrar a `ListScreenLayout`:

| Pantalla | Archivo |
|---|---|
| ProductoresScreen | `screens/ProductoresScreen.tsx` |
| ParcelasScreen | `screens/ParcelasScreen.tsx` |
| CampaniasScreen | `screens/CampaniasScreen.tsx` |
| CultivosScreen | `screens/CultivosScreen.tsx` |
| InspeccionesScreen | `screens/InspeccionesScreen.tsx` |
| ActividadesScreen | `screens/ActividadesScreen.tsx` |
| AcopiosScreen | `screens/AcopiosScreen.tsx` |
| RecepcionesScreen | `screens/RecepcionesScreen.tsx` |
| FamiliaresScreen | `screens/FamiliaresScreen.tsx` |

Cambios por pantalla:
- Eliminar StyleSheet duplicado (~100-150 líneas por archivo)
- Eliminar `handleLogout` inline → usar `useLogout()`
- Eliminar `useDebounce` inline → importar de hooks
- Eliminar `estadoConfig` inline → importar de `utils/statusConfig`
- Eliminar grid de KPIs manual → usar `KpiGrid`
- Eliminar search bar manual → usar `SearchInput` del layout
- Eliminar card rendering manual → usar `renderItem` prop
- Agregar `CustomHeader` a pantallas que no lo tienen
- Usar `colors.background` de ThemeContext en lugar de `#F9FAFB` hardcoded

### 6.2 Pantallas de Detalle (7 pantallas)
Migrar a `DetailScreenLayout`:

| Pantalla | Archivo |
|---|---|
| ProductorDetailScreen | `screens/ProductorDetailScreen.tsx` |
| ParcelaDetailScreen | `screens/ParcelaDetailScreen.tsx` |
| CampaniaDetailScreen | `screens/CampaniaDetailScreen.tsx` |
| CultivoDetailScreen | `screens/CultivoDetailScreen.tsx` |
| InspeccionDetailScreen | `screens/InspeccionDetailScreen.tsx` |
| ActividadDetailScreen | `screens/ActividadDetailScreen.tsx` |
| AcopioDetailScreen | `screens/AcopioDetailScreen.tsx` |
| RecepcionDetailScreen | `screens/RecepcionDetailScreen.tsx` |

Cambios por pantalla:
- Eliminar header manual (icon + name + badge)
- Eliminar KPI row manual
- Eliminar section styling duplicado
- Unificar botones de acción (editar, eliminar)
- Usar `InfoRow` existente de forma consistente

### 6.3 Pantallas de Formulario (8 pantallas)
Migrar a `FormScreenLayout`:

| Pantalla | Archivo |
|---|---|
| ParcelaFormScreen | `screens/ParcelaFormScreen.tsx` |
| CampaniaFormScreen | `screens/CampaniaFormScreen.tsx` |
| CultivoFormScreen | `screens/CultivoFormScreen.tsx` |
| InspeccionFormScreen | `screens/InspeccionFormScreen.tsx` |
| ActividadFormScreen | `screens/ActividadFormScreen.tsx` |
| AcopioFormScreen | `screens/AcopioFormScreen.tsx` |
| RecepcionFormScreen | `screens/RecepcionFormScreen.tsx` |
| ProductorCreateScreen | `screens/ProductorCreateScreen.tsx` |
| ProductorEditScreen | `screens/ProductorEditScreen.tsx` |
| FamiliarCreateScreen | `screens/FamiliarCreateScreen.tsx` |
| FamiliarEditScreen | `screens/FamiliarEditScreen.tsx` |

Cambios por pantalla:
- Eliminar header manual con botón retroceso
- Eliminar stepper manual (donde existe)
- Eliminar footer con botones de navegación
- Eliminar estilos de input/label duplicados
- Unificar estilos de sección

### 6.4 Pantallas de Menú (2 pantallas)
Migrar a `MenuScreenLayout`:

| Pantalla | Archivo |
|---|---|
| CampoScreen | `screens/CampoScreen.tsx` |
| OperacionesScreen | `screens/OperacionesScreen.tsx` |

### 6.5 Pantallas Especiales
- **DashboardScreen**: Mantener estructura única pero usar tokens y `KpiGrid`
- **LoginScreen**: Mantener diseño único pero usar tokens de color

---

## Fase 7: Eliminación de Duplicación

### 7.1 Estilos que se eliminan de pantallas individuales
Después de la migración, eliminar de cada pantalla:
- `safeArea` → del layout
- `header` / `headerLeft` / `title` / `subtitle` → del layout o PageHeader
- `addBtn` / `addBtnText` → del layout
- `statsGrid` / `statCard` / `statIcon` / `statValue` / `statLabel` → de KpiGrid
- `searchBox` / `searchInput` / `clearText` → de SearchInput
- `resultRow` / `resultCount` → del layout
- `card` / `avatar` / `cardInfo` / `cardName` / `cardMeta` / `cardCode` → renderItem
- `statusBadge` / `statusText` → Badge component
- `section` / `sectionTitle` → del layout
- `backBtn` / `headerTitle` → del layout
- `footer` / `prevBtn` / `nextBtn` / `saveBtn` → del layout
- Estilos de input/label → tokens compartidos

### 7.2 Imports que se limpian
Cada pantalla refactorizada:
- Elimina imports no utilizados (TextInput, StyleSheet innecesarios)
- Importa desde `components/layouts/` en lugar de re-implementar
- Importa `useLogout` en lugar de definir inline
- Importa `STATUS_COLORS` en lugar de definir `estadoConfig` inline
- Importa `useDebounce` de `hooks/` en lugar de definirlo inline

---

## Orden de Ejecución

1. **Fase 1**: Crear `theme/tokens.ts` y `theme/index.ts`
2. **Fase 2**: Actualizar `ThemeContext.tsx` con tokens expandidos
3. **Fase 5.1-5.3**: Crear utilidades compartidas (statusConfig, useLogout, useDebounce)
4. **Fase 4.2-4.4**: Crear nuevos componentes UI (SectionHeader, KpiGrid, PageHeader)
5. **Fase 4.1**: Actualizar componentes UI existentes para usar tokens
6. **Fase 3**: Crear las 4 plantillas de pantalla
7. **Fase 6.4**: Refactorizar pantallas de menú (2 - más simples)
8. **Fase 6.1**: Refactorizar pantallas de listado (9)
9. **Fase 6.2**: Refactorizar pantallas de detalle (8)
10. **Fase 6.3**: Refactorizar pantallas de formulario (11)
11. **Fase 6.5**: Refactorizar Dashboard y Login
12. **Fase 7**: Verificar eliminación completa de duplicación
13. **Verificación**: Ejecutar TypeScript compilation check

---

## Archivos a Crear
- `apps/mobile/src/theme/tokens.ts`
- `apps/mobile/src/theme/index.ts`
- `apps/mobile/src/components/layouts/ListScreenLayout.tsx`
- `apps/mobile/src/components/layouts/DetailScreenLayout.tsx`
- `apps/mobile/src/components/layouts/FormScreenLayout.tsx`
- `apps/mobile/src/components/layouts/MenuScreenLayout.tsx`
- `apps/mobile/src/components/ui/SectionHeader.tsx`
- `apps/mobile/src/components/ui/KpiGrid.tsx`
- `apps/mobile/src/components/ui/PageHeader.tsx`
- `apps/mobile/src/utils/statusConfig.ts`
- `apps/mobile/src/hooks/useLogout.ts`

## Archivos a Modificar
- `apps/mobile/src/contexts/ThemeContext.tsx`
- `apps/mobile/src/components/ui/index.ts` (agregar exports)
- `apps/mobile/src/components/ui/Card.tsx`
- `apps/mobile/src/components/ui/Badge.tsx`
- `apps/mobile/src/components/ui/StatCard.tsx`
- `apps/mobile/src/components/ui/SearchInput.tsx`
- `apps/mobile/src/components/ui/EmptyState.tsx`
- `apps/mobile/src/components/ui/InfoRow.tsx`
- `apps/mobile/src/components/ui/LoadingSpinner.tsx`
- `apps/mobile/src/components/ui/CustomHeader.tsx`
- `apps/mobile/src/components/ui/SelectField.tsx`
- `apps/mobile/src/components/ui/DatePickerField.tsx`
- Todas las 30 pantallas en `apps/mobile/src/screens/`

## Archivos a Verificar (Existencia)
- `apps/mobile/src/hooks/useDebounce.ts`

---

## Criterios de Éxito
- Todas las 30 pantallas usan exactamente los mismos colores, espaciados y patrones
- No hay colores hex hardcoded en pantallas (solo en `theme/tokens.ts`)
- No hay `StyleSheet.create()` duplicado entre pantallas
- Dark mode funciona en todas las pantallas
- `handleLogout` no está duplicado
- `useDebounce` no está definido inline
- `estadoConfig` no está definido inline en ninguna pantalla
- TypeScript compila sin errores

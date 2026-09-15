import React, { type ReactElement } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { SearchInput, EmptyState, LoadingSpinner } from "../ui";
import { KpiGrid, type KpiItem } from "../ui/KpiGrid";
import { PageHeader } from "../ui/PageHeader";
import type { LucideIcon } from "lucide-react-native";

interface ListScreenLayoutProps<T> {
  title: string;
  subtitle?: string;
  header?: ReactElement;
  onAdd?: () => void;
  addButtonLabel?: string;
  addIcon?: LucideIcon;
  kpis?: KpiItem[];
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (v: string) => void;
  resultCount: number;
  resultLabel?: string;
  isSearching?: boolean;
  data: T[];
  renderItem: (item: T) => ReactElement;
  keyExtractor: (item: T) => string;
  onRefresh: () => void;
  refreshing: boolean;
  emptyTitle: string;
  emptyDescription: string;
  onEndReached?: () => void;
  ListFooterComponent?: ReactElement | null;
  ItemSeparatorComponent?: ReactElement | null;
}

export function ListScreenLayout<T>({
  title,
  subtitle,
  header,
  onAdd,
  addButtonLabel = "Nuevo",
  addIcon,
  kpis,
  searchPlaceholder = "Buscar...",
  searchValue,
  onSearchChange,
  resultCount,
  resultLabel = "resultados",
  isSearching,
  data,
  renderItem,
  keyExtractor,
  onRefresh,
  refreshing,
  emptyTitle,
  emptyDescription,
  onEndReached,
  ListFooterComponent,
  ItemSeparatorComponent,
}: ListScreenLayoutProps<T>) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top"]}>
      {header}

      <PageHeader
        title={title}
        subtitle={subtitle}
        action={onAdd ? { label: addButtonLabel, onPress: onAdd, icon: addIcon } : undefined}
      />

      <FlatList
        data={data}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {kpis && kpis.length > 0 ? <KpiGrid items={kpis} /> : null}

            <View style={styles.searchContainer}>
              <SearchInput
                placeholder={searchPlaceholder}
                value={searchValue}
                onChangeText={onSearchChange}
              />
            </View>

            <View style={styles.resultRow}>
              <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
                {resultCount} {resultLabel}
              </Text>
              {isSearching ? (
                <Text style={[styles.searchingText, { color: colors.textMuted }]}>Buscando...</Text>
              ) : null}
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState title={emptyTitle} description={emptyDescription} />
        }
        ItemSeparatorComponent={ItemSeparatorComponent ?? (() => <View style={styles.separator} />)}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={ListFooterComponent ?? null}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  searchContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 8,
  },
  resultCount: {
    fontSize: 13,
  },
  searchingText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  separator: {
    height: 8,
  },
});

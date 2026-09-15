import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/`/g, "&#x60;");
}

interface ParcelaMapaProps {
  latitud: number | null;
  longitud: number | null;
  altitud: number | null;
  nombre?: string;
  height?: number;
}

function getMapHtml(lat: number, lng: number, nombre: string, altitud: number | null): string {
  const safeNombre = sanitizeHtml(nombre);
  const safeAltitud = altitud !== null ? sanitizeHtml(String(altitud)) : null;
  const popupContent = safeAltitud
    ? `<b>${safeNombre}</b><br>Altitud: ${safeAltitud}m`
    : `<b>${safeNombre}</b>`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100%; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false }).setView([${lat}, ${lng}], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);
        var marker = L.marker([${lat}, ${lng}]).addTo(map);
        marker.bindPopup('${popupContent}').openPopup();
      </script>
    </body>
    </html>
  `;
}

export const ParcelaMapa = React.memo(function ParcelaMapa({
  latitud, longitud, altitud, nombre, height = 200,
}: ParcelaMapaProps) {
  if (!latitud || !longitud) {
    return (
      <View style={[styles.emptyContainer, { height }]}>
        <Text style={styles.emptyText}>Sin coordenadas GPS</Text>
      </View>
    );
  }

  const html = useMemo(() => getMapHtml(latitud, longitud, nombre || "Parcela", altitud), [latitud, longitud, nombre, altitud]);

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        originWhitelist={["about:blank"]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { borderRadius: 12, overflow: "hidden", marginHorizontal: 16, marginTop: 12 },
  webview: { width: "100%", height: "100%" },
  emptyContainer: { borderRadius: 12, backgroundColor: "#F3F4F6", marginHorizontal: 16, marginTop: 12, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#9CA3AF", fontSize: 14 },
});

import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { MapPin, Crosshair } from "lucide-react-native";

interface MapaInteractivoProps {
  latitud: number | null;
  longitud: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  onGetLocation: () => void;
  loadingLocation?: boolean;
  height?: number;
}

function getMapHtml(lat: number | null, lng: number | null) {
  const centerLat = lat ?? -13.62;
  const centerLng = lng ?? -73.87;
  const hasMarker = lat !== null && lng !== null;

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
        .leaflet-control-zoom { display: none; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false }).setView([${centerLat}, ${centerLng}], ${hasMarker ? 16 : 6});
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        var marker = ${hasMarker ? `L.marker([${centerLat}, ${centerLng}], { draggable: true }).addTo(map)` : 'null'};

        if (marker) {
          marker.on('dragend', function(e) {
            var pos = e.target.getLatLng();
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'move', lat: pos.lat, lng: pos.lng }));
          });
        }

        map.on('click', function(e) {
          var pos = e.latlng;
          if (marker) {
            marker.setLatLng(pos);
          } else {
            marker = L.marker(pos, { draggable: true }).addTo(map);
            marker.on('dragend', function(e) {
              var p = e.target.getLatLng();
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'move', lat: p.lat, lng: p.lng }));
            });
          }
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'move', lat: pos.lat, lng: pos.lng }));
        });

        function updateMarker(lat, lng) {
          if (marker) {
            marker.setLatLng([lat, lng]);
          } else {
            marker = L.marker([lat, lng], { draggable: true }).addTo(map);
            marker.on('dragend', function(e) {
              var p = e.target.getLatLng();
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'move', lat: p.lat, lng: p.lng }));
            });
          }
          map.setView([lat, lng], 16);
        }
      </script>
    </body>
    </html>
  `;
}

export function MapaInteractivo({ latitud, longitud, onLocationChange, onGetLocation, loadingLocation, height = 250 }: MapaInteractivoProps) {
  const webViewRef = useRef<WebView>(null);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "move") {
        onLocationChange(data.lat, data.lng);
      }
    } catch {}
  };

  const html = getMapHtml(latitud, longitud);

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        ref={webViewRef}
        source={{ html }}
        style={styles.webview}
        onMessage={handleMessage}
        scrollEnabled={false}
        originWhitelist={["*"]}
      />
      <TouchableOpacity style={styles.locationBtn} onPress={onGetLocation} disabled={loadingLocation}>
        {loadingLocation ? (
          <ActivityIndicator size="small" color="#166534" />
        ) : (
          <Crosshair size={20} color="#166534" />
        )}
      </TouchableOpacity>
      {latitud && longitud && (
        <View style={styles.coordBadge}>
          <MapPin size={12} color="#166534" />
          <Text style={styles.coordText}>{latitud.toFixed(6)}, {longitud.toFixed(6)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, overflow: "hidden", marginHorizontal: 16, marginTop: 12 },
  webview: { width: "100%", height: "100%" },
  locationBtn: {
    position: "absolute", top: 10, right: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#FFF", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  coordBadge: {
    position: "absolute", bottom: 10, left: 10,
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#FFF", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  coordText: { fontSize: 11, color: "#166534", fontWeight: "500" },
});

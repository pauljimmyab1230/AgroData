import React, { useRef, useState, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { Crosshair, Trash2, MapPin, Undo2, Layers, Mountain, Map, Globe, Satellite as SatelliteIcon } from "lucide-react-native";

function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/`/g, "&#x60;");
}

function getMapHtml(lat: number | null, lng: number | null, initialLayer: string): string {
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
        .leaflet-control-zoom { display: none !important; }
        .custom-zoom {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .zoom-btn {
          width: 40px; height: 40px; background: #FFF; border: none; border-radius: 8px;
          font-size: 20px; font-weight: bold; color: #166534; cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;
        }
        .zoom-btn:active { background: #f0f0f0; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <div class="custom-zoom">
        <button class="zoom-btn" onclick="map.zoomIn()">+</button>
        <button class="zoom-btn" onclick="map.zoomOut()">&minus;</button>
      </div>
      <script>
        var map = L.map('map', { zoomControl: false }).setView([${centerLat}, ${centerLng}], ${hasMarker ? 16 : 6});

        var layers = {
          satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }),
          relief: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 }),
          streets: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 })
        };

        var currentLayer = '${initialLayer}';
        layers[currentLayer].addTo(map);

        var marker = ${hasMarker ? `L.marker([${centerLat}, ${centerLng}], { draggable: true }).addTo(map)` : 'null'};
        if (marker) {
          marker.on('dragend', function(e) {
            var pos = e.target.getLatLng();
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'move', lat: pos.lat, lng: pos.lng }));
          });
        }

        map.on('click', function(e) {
          var pos = e.latlng;
          if (marker) { marker.setLatLng(pos); }
          else {
            marker = L.marker(pos, { draggable: true }).addTo(map);
            marker.on('dragend', function(ev) {
              var p = ev.target.getLatLng();
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'move', lat: p.lat, lng: p.lng }));
            });
          }
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'move', lat: pos.lat, lng: pos.lng }));
        });

        function switchLayer(name) {
          map.removeLayer(layers[currentLayer]);
          layers[name].addTo(map);
          currentLayer = name;
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'layer', layer: name }));
        }
      </script>
    </body>
    </html>
  `;
}

function getPolygonMapHtml(lat: number | null, lng: number | null, polygon: number[][], initialLayer: string): string {
  const centerLat = lat ?? -13.62;
  const centerLng = lng ?? -73.87;
  const hasMarker = lat !== null && lng !== null;
  const polygonStr = JSON.stringify(polygon);

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
        .leaflet-control-zoom { display: none !important; }
        .custom-zoom { position: absolute; top: 10px; left: 10px; z-index: 1000; display: flex; flex-direction: column; gap: 4px; }
        .zoom-btn { width: 40px; height: 40px; background: #FFF; border: none; border-radius: 8px; font-size: 20px; font-weight: bold; color: #166534; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; }
        .zoom-btn:active { background: #f0f0f0; }
        .polygon-info { position: absolute; bottom: 50px; left: 10px; right: 10px; background: rgba(255,255,255,0.95); padding: 8px 12px; border-radius: 8px; font-size: 12px; color: #166534; text-align: center; z-index: 1000; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
        .polygon-info strong { font-weight: 600; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <div class="custom-zoom">
        <button class="zoom-btn" onclick="map.zoomIn()">+</button>
        <button class="zoom-btn" onclick="map.zoomOut()">&minus;</button>
      </div>
      <div id="polygonInfo" class="polygon-info" style="display:none">
        <strong>Puntos:</strong> <span id="pointCount">0</span> | <strong>Toca</strong> para agregar | <strong>Toca primer punto</strong> para cerrar
      </div>
      <script>
        var map = L.map('map', { zoomControl: false, doubleClickZoom: false }).setView([${centerLat}, ${centerLng}], ${hasMarker || polygon.length > 0 ? 16 : 6});

        var layers = {
          satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }),
          relief: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 }),
          streets: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 })
        };

        var currentLayer = '${initialLayer}';
        layers[currentLayer].addTo(map);

        var polygonPoints = [];
        var polygonLayer = null;
        var vertexMarkers = [];
        var tempLine = null;

        var existingPolygon = ${polygonStr};
        if (existingPolygon.length > 2) {
          polygonPoints = existingPolygon;
          drawPolygon();
          updateInfo();
        }

        function drawPolygon() {
          if (polygonLayer) map.removeLayer(polygonLayer);
          vertexMarkers.forEach(function(m) { map.removeLayer(m); });
          vertexMarkers = [];
          if (polygonPoints.length >= 3) {
            polygonLayer = L.polygon(polygonPoints, { color: '#0A4174', weight: 3, fillOpacity: 0.3 }).addTo(map);
          }
          polygonPoints.forEach(function(point, i) {
            var marker = L.circleMarker(point, { radius: 6, fillColor: '#166534', color: '#FFFFFF', weight: 2, fillOpacity: 1 }).addTo(map);
            marker.on('click', function(e) {
              L.DomEvent.stopPropagation(e);
              if (i === 0 && polygonPoints.length >= 3) finishPolygon();
            });
            vertexMarkers.push(marker);
          });
          if (tempLine) map.removeLayer(tempLine);
          if (polygonPoints.length > 0) {
            tempLine = L.polyline(polygonPoints, { color: '#166534', weight: 2, dashArray: '5, 10' }).addTo(map);
          }
        }

        function finishPolygon() {
          if (tempLine) { map.removeLayer(tempLine); tempLine = null; }
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'polygon', coords: polygonPoints }));
          updateInfo();
        }

        function updateInfo() {
          var infoEl = document.getElementById('polygonInfo');
          var countEl = document.getElementById('pointCount');
          if (polygonPoints.length > 0) { infoEl.style.display = 'block'; countEl.textContent = polygonPoints.length; }
          else { infoEl.style.display = 'none'; }
        }

        map.on('click', function(e) {
          polygonPoints.push([e.latlng.lat, e.latlng.lng]);
          drawPolygon();
          updateInfo();
        });

        function undoLastPoint() {
          if (polygonPoints.length > 0) {
            polygonPoints.pop();
            drawPolygon();
            updateInfo();
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'polygon', coords: polygonPoints.length >= 3 ? polygonPoints : [] }));
          }
        }

        function clearPolygon() {
          polygonPoints = [];
          if (polygonLayer) { map.removeLayer(polygonLayer); polygonLayer = null; }
          if (tempLine) { map.removeLayer(tempLine); tempLine = null; }
          vertexMarkers.forEach(function(m) { map.removeLayer(m); });
          vertexMarkers = [];
          updateInfo();
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'polygon', coords: [] }));
        }

        function switchLayer(name) {
          map.removeLayer(layers[currentLayer]);
          layers[name].addTo(map);
          currentLayer = name;
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'layer', layer: name }));
        }

        var marker = ${hasMarker ? `L.marker([${centerLat}, ${centerLng}], { draggable: true }).addTo(map)` : 'null'};
        if (marker) {
          marker.on('dragend', function(e) {
            var pos = e.target.getLatLng();
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'move', lat: pos.lat, lng: pos.lng }));
          });
        }
      </script>
    </body>
    </html>
  `;
}

interface MapaInteractivoProps {
  latitud: number | null;
  longitud: number | null;
  onLocationChange?: (lat: number, lng: number) => void;
  onGetLocation?: () => void;
  loadingLocation?: boolean;
  height?: number;
  showLayers?: boolean;
}

export const MapaInteractivo = React.memo(function MapaInteractivo({
  latitud, longitud, onLocationChange, onGetLocation, loadingLocation, height = 250, showLayers = true,
}: MapaInteractivoProps) {
  const webViewRef = useRef<WebView>(null);
  const [currentLayer, setCurrentLayer] = useState("streets");

  const handleMessage = useCallback((event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "move" && onLocationChange) onLocationChange(data.lat, data.lng);
      if (data.type === "layer") setCurrentLayer(data.layer);
    } catch {}
  }, [onLocationChange]);

  const switchLayer = useCallback((name: string) => {
    const safeName = ["streets", "satellite", "relief"].includes(name) ? name : "streets";
    webViewRef.current?.injectJavaScript(`switchLayer('${safeName}');`);
    setCurrentLayer(safeName);
  }, []);

  const html = useMemo(() => getMapHtml(latitud, longitud, currentLayer), [latitud, longitud, currentLayer]);

  return (
    <View style={[styles.container, { height }]}>
      <WebView ref={webViewRef} source={{ html }} style={styles.webview} onMessage={handleMessage} scrollEnabled={false} originWhitelist={["about:blank"]} />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={onGetLocation} disabled={loadingLocation} accessibilityLabel="Obtener ubicación actual" accessibilityRole="button">
          {loadingLocation ? <ActivityIndicator size="small" color="#166534" /> : <Crosshair size={18} color="#166534" />}
        </TouchableOpacity>
      </View>
      {showLayers && (
        <View style={styles.layerBar}>
          <TouchableOpacity style={[styles.layerBtn, currentLayer === "streets" && styles.layerBtnActive]} onPress={() => switchLayer("streets")} accessibilityLabel="Vista calles" accessibilityRole="button">
            <Map size={14} color={currentLayer === "streets" ? "#FFF" : "#166534"} /><Text style={[styles.layerText, currentLayer === "streets" && styles.layerTextActive]}>Calles</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.layerBtn, currentLayer === "satellite" && styles.layerBtnActive]} onPress={() => switchLayer("satellite")} accessibilityLabel="Vista satelital" accessibilityRole="button">
            <SatelliteIcon size={14} color={currentLayer === "satellite" ? "#FFF" : "#166534"} /><Text style={[styles.layerText, currentLayer === "satellite" && styles.layerTextActive]}>Satelital</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.layerBtn, currentLayer === "relief" && styles.layerBtnActive]} onPress={() => switchLayer("relief")} accessibilityLabel="Vista relieve" accessibilityRole="button">
            <Mountain size={14} color={currentLayer === "relief" ? "#FFF" : "#166534"} /><Text style={[styles.layerText, currentLayer === "relief" && styles.layerTextActive]}>Relieve</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

interface PolygonMapProps {
  latitud: number | null;
  longitud: number | null;
  poligono: number[][];
  onPolygonChange: (coords: number[][]) => void;
  onLocationChange?: (lat: number, lng: number) => void;
  onGetLocation?: () => void;
  loadingLocation?: boolean;
  height?: number;
  showLayers?: boolean;
}

export const PolygonMap = React.memo(function PolygonMap({
  latitud, longitud, poligono, onPolygonChange, onLocationChange, onGetLocation, loadingLocation, height = 300, showLayers = true,
}: PolygonMapProps) {
  const webViewRef = useRef<WebView>(null);
  const [currentLayer, setCurrentLayer] = useState("streets");

  const handleMessage = useCallback((event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "move" && onLocationChange) onLocationChange(data.lat, data.lng);
      if (data.type === "polygon") onPolygonChange(data.coords);
      if (data.type === "layer") setCurrentLayer(data.layer);
    } catch {}
  }, [onLocationChange, onPolygonChange]);

  const switchLayer = useCallback((name: string) => {
    const safeName = ["streets", "satellite", "relief"].includes(name) ? name : "streets";
    webViewRef.current?.injectJavaScript(`switchLayer('${safeName}');`);
    setCurrentLayer(safeName);
  }, []);

  const undoLast = useCallback(() => {
    webViewRef.current?.injectJavaScript("undoLastPoint();");
  }, []);

  const clearPolygon = useCallback(() => {
    webViewRef.current?.injectJavaScript("clearPolygon();");
  }, []);

  const html = useMemo(() => getPolygonMapHtml(latitud, longitud, poligono, currentLayer), [latitud, longitud, poligono, currentLayer]);

  return (
    <View style={[styles.container, { height }]}>
      <WebView ref={webViewRef} source={{ html }} style={styles.webview} onMessage={handleMessage} scrollEnabled={false} originWhitelist={["about:blank"]} />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={onGetLocation} disabled={loadingLocation} accessibilityLabel="Obtener ubicación actual" accessibilityRole="button">
          {loadingLocation ? <ActivityIndicator size="small" color="#166534" /> : <Crosshair size={18} color="#166534" />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={undoLast} accessibilityLabel="Deshacer último punto" accessibilityRole="button">
          <Undo2 size={18} color="#CA8A04" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={clearPolygon} accessibilityLabel="Limpiar polígono" accessibilityRole="button">
          <Trash2 size={18} color="#DC2626" />
        </TouchableOpacity>
      </View>
      {showLayers && (
        <View style={styles.layerBar}>
          <TouchableOpacity style={[styles.layerBtn, currentLayer === "streets" && styles.layerBtnActive]} onPress={() => switchLayer("streets")} accessibilityLabel="Vista calles" accessibilityRole="button">
            <Map size={14} color={currentLayer === "streets" ? "#FFF" : "#166534"} /><Text style={[styles.layerText, currentLayer === "streets" && styles.layerTextActive]}>Calles</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.layerBtn, currentLayer === "satellite" && styles.layerBtnActive]} onPress={() => switchLayer("satellite")} accessibilityLabel="Vista satelital" accessibilityRole="button">
            <SatelliteIcon size={14} color={currentLayer === "satellite" ? "#FFF" : "#166534"} /><Text style={[styles.layerText, currentLayer === "satellite" && styles.layerTextActive]}>Satelital</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.layerBtn, currentLayer === "relief" && styles.layerBtnActive]} onPress={() => switchLayer("relief")} accessibilityLabel="Vista relieve" accessibilityRole="button">
            <Mountain size={14} color={currentLayer === "relief" ? "#FFF" : "#166534"} /><Text style={[styles.layerText, currentLayer === "relief" && styles.layerTextActive]}>Relieve</Text>
          </TouchableOpacity>
        </View>
      )}
      {poligono.length > 0 && (
        <View style={styles.areaBadge}>
          <Text style={styles.areaText}>{poligono.length} puntos</Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { borderRadius: 12, overflow: "hidden", marginHorizontal: 16, marginTop: 12 },
  webview: { width: "100%", height: "100%" },
  controls: { position: "absolute", top: 10, right: 10, gap: 8 },
  controlBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#FFF", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  layerBar: {
    position: "absolute", bottom: 10, left: 10,
    flexDirection: "row", gap: 4,
    backgroundColor: "#FFF", padding: 4, borderRadius: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  layerBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
  },
  layerBtnActive: { backgroundColor: "#166534" },
  layerText: { fontSize: 11, fontWeight: "500", color: "#166534" },
  layerTextActive: { color: "#FFF" },
  areaBadge: {
    position: "absolute", bottom: 50, left: 10, right: 10,
    backgroundColor: "rgba(255,255,255,0.95)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
    alignItems: "center",
  },
  areaText: { fontSize: 12, fontWeight: "600", color: "#166534" },
});

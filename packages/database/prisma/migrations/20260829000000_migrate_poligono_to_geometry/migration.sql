-- Migrate poligono from JSON to MULTIPOLYGON geometry (SRID 4326)
-- The API layer converts [lat, lng][] arrays to WKT MULTIPOLYGON

-- 1. Add geometry column
ALTER TABLE parcelas_productor ADD COLUMN poligono_geom GEOMETRY NULL;

-- 2. (Data conversion done via Node.js script if needed)

-- 3. Drop old JSON column and rename
ALTER TABLE parcelas_productor DROP COLUMN poligono;
ALTER TABLE parcelas_productor RENAME COLUMN poligono_geom TO poligono;

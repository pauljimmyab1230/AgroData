export function latLngToUtm(lat: number, lng: number): { este: string; norte: string; zona: string } {
  const zone = Math.floor((lng + 180) / 6) + 1;
  const letter = lat >= -80 && lat < -72 ? 'C' : lat >= -72 && lat < -64 ? 'D' : lat >= -64 && lat < -56 ? 'E' :
    lat >= -56 && lat < -48 ? 'F' : lat >= -48 && lat < -40 ? 'G' : lat >= -40 && lat < -32 ? 'H' :
    lat >= -32 && lat < -24 ? 'J' : lat >= -24 && lat < -16 ? 'K' : lat >= -16 && lat < -8 ? 'L' :
    lat >= -8 && lat < 0 ? 'M' : lat >= 0 && lat < 8 ? 'N' : lat >= 8 && lat < 16 ? 'P' :
    lat >= 16 && lat < 24 ? 'Q' : lat >= 24 && lat < 32 ? 'R' : lat >= 32 && lat < 40 ? 'S' :
    lat >= 40 && lat < 48 ? 'T' : lat >= 48 && lat < 56 ? 'U' : lat >= 56 && lat < 64 ? 'V' :
    lat >= 64 && lat < 72 ? 'W' : 'X';

  const a = 6378137;
  const f = 1 / 298.257223563;
  const k0 = 0.9996;
  const e = Math.sqrt(2 * f - f * f);
  const e2 = e * e;
  const ep2 = e2 / (1 - e2);

  const dLng = (lng - (zone * 6 - 183)) * Math.PI / 180;
  const latRad = lat * Math.PI / 180;

  const N = a / Math.sqrt(1 - e2 * Math.sin(latRad) ** 2);
  const T = Math.tan(latRad) ** 2;
  const C = ep2 * Math.cos(latRad) ** 2;
  const A = Math.cos(latRad) * dLng;

  const M = a * (
    (1 - e2 / 4 - 3 * e2 ** 2 / 64 - 5 * e2 ** 3 / 256) * latRad -
    (3 * e2 / 8 + 3 * e2 ** 2 / 32 + 45 * e2 ** 3 / 1024) * Math.sin(2 * latRad) +
    (15 * e2 ** 2 / 256 + 45 * e2 ** 3 / 1024) * Math.sin(4 * latRad) -
    (35 * e2 ** 3 / 3072) * Math.sin(6 * latRad)
  );

  let easting = k0 * N * (A + (1 - T + C) * A ** 3 / 6 + (5 - 18 * T + T ** 2 + 72 * C - 58 * ep2) * A ** 5 / 120) + 500000;
  let northing = k0 * (M + N * Math.tan(latRad) * (A ** 2 / 2 + (5 - T + 9 * C + 4 * C ** 2) * A ** 4 / 24 + (61 - 58 * T + T ** 2 + 600 * C - 330 * ep2) * A ** 6 / 720));

  if (lat < 0) northing += 10000000;

  return {
    este: Math.round(easting).toString(),
    norte: Math.round(northing).toString(),
    zona: `${zone}${letter}`,
  };
}

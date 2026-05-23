import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";

const ZONE_COLORS = {
  residential: "blue",
  agriculture: "green",
  water_harvesting: "cyan",
  solar_energy_zone: "orange",
  public_services: "purple",
  roads: "brown",
};

function MapLegend() {
  return (
    <div className="map-legend">
      <h4>Zone Legend</h4>
      {Object.entries(ZONE_COLORS).map(([zone, color]) => (
        <div key={zone} className="map-legend-row">
          <span className="map-swatch" style={{ backgroundColor: color }} />
          <span style={{ textTransform: "capitalize" }}>{zone.replace("_", " ")}</span>
        </div>
      ))}
    </div>
  );
}

export default function MapRenderer({ layout, expanded = false, onExpand }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  const mapHeight = useMemo(() => (expanded ? "72vh" : "520px"), [expanded]);

  useEffect(() => {
    if (mapRef.current) {
      window.setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 150);
    }
  }, [expanded, layout]);

  if (!layout || !layout.zones) {
    return (
      <div className="map-placeholder">
        <div className="map-placeholder__title">Generate a layout to preview the village map.</div>
        <div className="map-placeholder__sub">The map will render here on the left once AI output is available.</div>
      </div>
    );
  }

  const MAP_CENTER = [20.5937, 78.9629];
  const SCALE = 0.05;

  return (
    <div ref={containerRef} style={{ position: "relative", height: "100%" }}>
      {onExpand && (
        <button type="button" className="map-expand-btn" onClick={onExpand}>
          Expand
        </button>
      )}
      <MapContainer
        center={MAP_CENTER}
        zoom={6}
        style={{ height: mapHeight, width: "100%" }}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {layout.zones.map((zone, idx) => {
          const color = ZONE_COLORS[zone.zone_name] || "gray";

          const positions = zone.coordinates.map((c) => [
            MAP_CENTER[0] + c.y * SCALE,
            MAP_CENTER[1] + c.x * SCALE,
          ]);

          return (
            <Polygon
              key={idx}
              positions={positions}
              pathOptions={{
                color,
                fillOpacity: 0.4,
                weight: 2,
              }}
            >
              <Popup>
                <strong>{zone.zone_name}</strong>
                <br />
                {zone.purpose}
              </Popup>
            </Polygon>
          );
        })}
      </MapContainer>

      <MapLegend />
    </div>
  );
}

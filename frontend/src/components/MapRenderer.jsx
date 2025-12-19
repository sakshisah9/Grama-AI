// src/components/MapRenderer.jsx

import React from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";

// Simple zone color mapping (frontend concern)
const ZONE_COLORS = {
  residential: "blue",
  agriculture: "green",
  water_harvesting: "cyan",
  solar_energy_zone: "orange",
  public_services: "purple",
  roads: "brown",
};

export default function MapRenderer({ layout }) {
  if (!layout || !layout.zones) return null;

  // Fixed demo center (Phase-1, non-GIS)
  const MAP_CENTER = [20.5937, 78.9629]; // India center
  const SCALE = 0.05; // visual scaling factor

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={6}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render zones */}
      {layout.zones.map((zone, idx) => {
        const color = ZONE_COLORS[zone.zone_name] || "gray";

        // Convert normalized coordinates → lat/lng
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
  );
}

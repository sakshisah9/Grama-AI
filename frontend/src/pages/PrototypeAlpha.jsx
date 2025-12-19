// src/pages/QuickPrototype.jsx

import React, { useState } from "react";
import MapRenderer from "../components/MapRenderer";

/* ================= Village Presets ================= */

const VILLAGE_PRESETS = {
  "Hiware Bazar": {
    population: 1233,
    area_sq_km: 9.89,
    water_supply_lpd: 250000,
    green_area_sq_km: 0.74,
    solar_irradiance_kwpm2: 5.7,
  },
  "Ralegan Siddhi": {
    population: 2365,
    area_sq_km: 10.01,
    water_supply_lpd: 250000,
    green_area_sq_km: 1.36,
    solar_irradiance_kwpm2: 5.8,
  },
};

export default function QuickPrototype() {
  const [selectedVillage, setSelectedVillage] = useState("Hiware Bazar");
  const [inputs, setInputs] = useState(VILLAGE_PRESETS["Hiware Bazar"]);

  const [layout, setLayout] = useState(null);
  const [score, setScore] = useState(null);
  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= Helpers ================= */

  const updateField = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= API Call ================= */

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setLayout(null);
    setScore(null);
    setReport(null);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/planning/generate-layout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            village: selectedVillage,
            inputs: inputs,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Backend error");
      }

      const aiResult = await res.json();

      // ✅ Directly use backend output (already structured)
      setLayout(aiResult.layout);
      setScore(aiResult.sustainability_score);
      setReport(aiResult.sustainability_report);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Grama-AI — Prototype Alpha
      </h1>

      {/* Village Selector */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Village</label>
        <select
          className="border p-2 rounded w-full md:w-1/3"
          value={selectedVillage}
          onChange={(e) => {
            const v = e.target.value;
            setSelectedVillage(v);
            setInputs(VILLAGE_PRESETS[v]);
            setLayout(null);
            setScore(null);
            setReport(null);
          }}
        >
          {Object.keys(VILLAGE_PRESETS).map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input
          label="Population"
          value={inputs.population}
          onChange={(v) => updateField("population", v)}
        />
        <Input
          label="Area (sq km)"
          value={inputs.area_sq_km}
          onChange={(v) => updateField("area_sq_km", v)}
          step="0.01"
        />
        <Input
          label="Water Supply (LPD)"
          value={inputs.water_supply_lpd}
          onChange={(v) => updateField("water_supply_lpd", v)}
        />
        <Input
          label="Green Area (sq km)"
          value={inputs.green_area_sq_km}
          onChange={(v) => updateField("green_area_sq_km", v)}
          step="0.01"
        />
        <Input
          label="Solar Irradiance (kW/m²)"
          value={inputs.solar_irradiance_kwpm2}
          onChange={(v) => updateField("solar_irradiance_kwpm2", v)}
          step="0.01"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-6 py-2 bg-orange-500 text-white rounded"
      >
        {loading ? "Generating..." : "Generate Layout"}
      </button>

      {error && (
        <p className="text-red-600 mt-3">❌ {error}</p>
      )}

      {/* Map */}
      {layout && (
        <div className="mt-8">
          <MapRenderer layout={layout} />
        </div>
      )}

      {/* Sustainability Output */}
      {score !== null && report && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Score */}
          <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-bold mb-2">
              🌱 Sustainability Score
            </h2>
            <div className="text-4xl font-extrabold text-green-600">
              {score} / 10
            </div>
          </div>

          {/* Report */}
          <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-bold mb-3">
              📄 Sustainability Report
            </h2>

            <ReportSection title="Strengths" items={report.strengths} />
            <ReportSection title="Weaknesses" items={report.weaknesses} />
            <ReportSection title="Recommendations" items={report.recommendations} />
            <ReportSection title="Priority Actions" items={report.priority_actions} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= Reusable Components ================= */

function Input({ label, value, onChange, step }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">
        {label}
      </label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border p-2 w-full rounded"
      />
    </div>
  );
}

function ReportSection({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-1">{title}</h3>
      <ul className="list-disc list-inside text-sm text-gray-700">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

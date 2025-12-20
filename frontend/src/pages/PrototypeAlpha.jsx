import React, { useState } from "react";
import MapRenderer from "../components/MapRenderer";
import logo from "../assets/logo.png";

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

  const updateField = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

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

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* ===== FIXED CORNER LOGO ===== */}
      <img
  src={logo}
  alt="Grama-AI Logo"
  className="
    fixed top-4 left-4 z-50
    w-10 h-10
    max-w-[40px] max-h-[40px]
    object-contain
    bg-white rounded-md p-1 shadow
  "
/>


      {/* ===== Header ===== */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Grama-AI — Prototype Alpha
        </h1>
        <p className="text-sm text-gray-600">
          AI-powered rural planning • Phase 1
        </p>
      </div>

      {/* ===== Village Selector ===== */}
      <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
        <label className="block font-semibold mb-2">
          Select Village
        </label>
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

      {/* ===== Input Fields ===== */}
      <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">
          Village Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Population" value={inputs.population} onChange={(v) => updateField("population", v)} />
          <Input label="Area (sq km)" value={inputs.area_sq_km} step="0.01" onChange={(v) => updateField("area_sq_km", v)} />
          <Input label="Water Supply (LPD)" value={inputs.water_supply_lpd} onChange={(v) => updateField("water_supply_lpd", v)} />
          <Input label="Green Area (sq km)" value={inputs.green_area_sq_km} step="0.01" onChange={(v) => updateField("green_area_sq_km", v)} />
          <Input label="Solar Irradiance (kW/m²)" value={inputs.solar_irradiance_kwpm2} step="0.01" onChange={(v) => updateField("solar_irradiance_kwpm2", v)} />
        </div>
      </div>

      {/* ===== Generate Button ===== */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
      >
        {loading ? "Generating…" : "Generate AI Layout"}
      </button>

      {error && (
        <p className="text-red-600 mt-4">❌ {error}</p>
      )}

      {/* ===== Map ===== */}
      {layout && (
        <div className="mt-10 bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="font-semibold mb-3">
            Generated Village Layout
          </h2>
          <MapRenderer layout={layout} />
        </div>
      )}

      {/* ===== Sustainability Output ===== */}
      {score !== null && report && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 border rounded-lg shadow-sm bg-white">
            <h2 className="text-lg font-bold mb-2">
              🌱 Sustainability Score
            </h2>
            <div className="text-5xl font-bold text-green-600">
              {score}
              <span className="text-lg text-gray-500"> / 10</span>
            </div>
          </div>

          <div className="p-5 border rounded-lg shadow-sm bg-white">
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

      <div className="mt-14 text-center text-xs text-gray-500">
        Grama-AI • Phase-1 Prototype • Demo Build
      </div>
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

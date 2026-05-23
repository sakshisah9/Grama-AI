import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MapRenderer from "../components/MapRenderer";
import logo from "../assets/logo.png";

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
  Ruti: {
    population: 352,
    area_sq_km: 2.2498,
    water_supply_lpd: 72000,
    green_area_sq_km: 0.26,
    solar_irradiance_kwpm2: 5.6,
  },
  Wagholi: {
    population: 854,
    area_sq_km: 4.06,
    water_supply_lpd: 128000,
    green_area_sq_km: 0.48,
    solar_irradiance_kwpm2: 5.65,
  },
};

const VILLAGE_META = {
  "Hiware Bazar": {
    district: "Ahmednagar",
    taluka: "Nagar",
    accent: "#2f6bff",
    description: "A high-profile sustainability benchmark with strong water, health, and education systems.",
  },
  "Ralegan Siddhi": {
    district: "Ahmednagar",
    taluka: "Parner",
    accent: "#0ea5a4",
    description: "A village-scale model for watershed thinking, community infrastructure, and resilience.",
  },
  Ruti: {
    district: "Beed",
    taluka: "Ashti",
    accent: "#f59e0b",
    description: "A compact settlement with a smaller land base and a strong need for efficient spatial planning.",
  },
  Wagholi: {
    district: "Beed",
    taluka: "Dharur",
    accent: "#8b5cf6",
    description: "A mid-sized rural context suited to balanced zoning, services, and transport links.",
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
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const activeMeta = VILLAGE_META[selectedVillage];
  const presetCards = useMemo(
    () =>
      Object.entries(VILLAGE_PRESETS).map(([name, preset]) => {
        const meta = VILLAGE_META[name];
        return {
          name,
          meta,
          preset,
          density: (preset.population / preset.area_sq_km).toFixed(1),
        };
      }),
    []
  );

  const updateField = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const resetSelection = (villageName) => {
    const preset = VILLAGE_PRESETS[villageName];
    setSelectedVillage(villageName);
    setInputs(preset);
    setLayout(null);
    setScore(null);
    setReport(null);
    setError("");
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setLayout(null);
    setScore(null);
    setReport(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/planning/generate-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          village: selectedVillage,
          inputs,
        }),
      });

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
    <main className={`app-shell ${isMapExpanded ? "workspace--expanded" : ""}`}>
      <div className="page-shell">
        <div className="topbar topbar--workspace">
          <div className="brand-mark">
            <img src={logo} alt="Grama-AI Logo" className="brand-mark__logo" />
            <div>
              <div className="eyebrow">Grama-AI Prototype Alpha</div>
              <div className="status">Village planning workspace</div>
            </div>
          </div>
          <div className="topbar-links">
            <Link className="btn btn-secondary btn-small" to="/login">
              Login
            </Link>
            <Link className="btn btn-secondary btn-small" to="/account">
              Account
            </Link>
          </div>
        </div>

        <section className="hero hero--workspace">
          <div className="hero-card hero-card--workspace">
            <div className="hero-copy">
              <div className="eyebrow">Village planning, upgraded</div>
              <h1 className="hero-title">
                Build a more cinematic rural planning demo with richer datasets and a stronger visual story.
              </h1>
              <p className="hero-subtitle">
                Choose a village case study, tune the planning inputs, and generate an AI-assisted spatial layout
                that feels like a design review, not just a form submission.
              </p>
            </div>
          </div>
        </section>

        <section className="feature-grid feature-grid--gallery">
          {presetCards.map((card) => (
            <button
              key={card.name}
              className={`feature-card village-card ${selectedVillage === card.name ? "village-card--active" : ""}`}
              onClick={() => resetSelection(card.name)}
              style={{ "--accent": card.meta.accent }}
            >
              <div className="village-card__top">
                <div>
                  <div className="village-card__name">{card.name}</div>
                  <div className="village-card__meta">
                    {card.meta.district} · {card.meta.taluka}
                  </div>
                </div>
                <div className="village-card__dot" />
              </div>
              <p>{card.meta.description}</p>
              <div className="village-card__stats">
                <span>{card.preset.population} people</span>
                <span>{card.density} density</span>
                <span>{card.preset.area_sq_km} sq km</span>
              </div>
            </button>
          ))}
        </section>

        <section className="panel panel--creative">
          <div className="panel-header">
            <div>
              <div className="panel-title">Village settings</div>
              <div className="panel-description">Adjust the planning inputs before generating a layout.</div>
            </div>
            <div className="panel-chip">Live input / creative mode</div>
          </div>

          <div className="field field--full" style={{ marginBottom: "18px" }}>
            <label className="select-label">Select Village</label>
            <select
              className="select-input"
              value={selectedVillage}
              onChange={(e) => resetSelection(e.target.value)}
            >
              {Object.keys(VILLAGE_PRESETS).map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="form-grid">
            <Input label="Population" value={inputs.population} onChange={(v) => updateField("population", v)} />
            <Input
              label="Area (sq km)"
              value={inputs.area_sq_km}
              step="0.01"
              onChange={(v) => updateField("area_sq_km", v)}
            />
            <Input
              label="Water Supply (LPD)"
              value={inputs.water_supply_lpd}
              onChange={(v) => updateField("water_supply_lpd", v)}
            />
            <Input
              label="Green Area (sq km)"
              value={inputs.green_area_sq_km}
              step="0.01"
              onChange={(v) => updateField("green_area_sq_km", v)}
            />
            <Input
              label="Solar Irradiance (kW/m²)"
              value={inputs.solar_irradiance_kwpm2}
              step="0.01"
              onChange={(v) => updateField("solar_irradiance_kwpm2", v)}
            />
          </div>

          <div className="section-actions">
            <div className="status">Click generate to create a new layout from the current village parameters.</div>
            <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating..." : "Generate AI Layout"}
            </button>
          </div>

          {error && <div className="alert">Failed to generate layout: {error}</div>}
        </section>

        <section className={`workspace-grid ${isMapExpanded ? "workspace-grid--expanded" : ""}`}>
          <div className="workspace-left">
            <div className="panel-header workspace-header">
              <div>
                <div className="panel-title">Generated village layout</div>
                <div className="panel-description">Map stays on the left; expand it if you want a full-view glance.</div>
              </div>
              <button className="btn btn-secondary btn-small" onClick={() => setIsMapExpanded((prev) => !prev)}>
                {isMapExpanded ? "Collapse map" : "Expand map"}
              </button>
            </div>

            <div className={`map-card map-card--creative ${isMapExpanded ? "map-card--expanded" : ""}`}>
              <div className="map-frame">
                <MapRenderer layout={layout} expanded={isMapExpanded} onExpand={() => setIsMapExpanded(true)} />
              </div>
            </div>
          </div>

          <div className="workspace-right">
            {score !== null && report && (
              <>
                <div className="metric-card score-card">
                  <div className="eyebrow">Sustainability score</div>
                  <div className="score-value">
                    {score}
                    <span> / 10</span>
                  </div>
                  <div className="metric-label">
                    A quick summary of the proposed village plan&apos;s overall sustainability fit.
                  </div>
                </div>

                <div className="report-card panel panel--creative">
                  <div className="panel-header">
                    <div>
                      <div className="panel-title">Sustainability report</div>
                      <div className="panel-description">Strengths, gaps, and next-step recommendations.</div>
                    </div>
                  </div>

                  <ReportSection title="Strengths" items={report.strengths} />
                  <ReportSection title="Weaknesses" items={report.weaknesses} />
                  <ReportSection title="Recommendations" items={report.recommendations} />
                  <ReportSection title="Priority Actions" items={report.priority_actions} />
                </div>
              </>
            )}

            {score === null && (
              <div className="panel empty-state">
                <div className="panel-title">No layout yet</div>
                <div className="panel-description">Generate a layout to see score and report details here.</div>
              </div>
            )}
          </div>
        </section>

        <div className="footer-note">Grama-AI · Phase-1 Prototype · Demo Build</div>

        {isMapExpanded && (
          <div className="map-modal" role="dialog" aria-modal="true" aria-label="Expanded map view">
            <div className="map-modal__backdrop" onClick={() => setIsMapExpanded(false)} />
            <div className="map-modal__sheet">
              <div className="map-modal__header">
                <div>
                  <div className="panel-title">Expanded village map</div>
                  <div className="panel-description">A focused overlay for full-screen style viewing.</div>
                </div>
                <button className="btn btn-secondary btn-small" onClick={() => setIsMapExpanded(false)}>
                  Close
                </button>
              </div>
              <div className="map-modal__body">
                <MapRenderer layout={layout} expanded onExpand={() => setIsMapExpanded(true)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Input({ label, value, onChange, step }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type="number" step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function ReportSection({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="report-section">
      <h3>{title}</h3>
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

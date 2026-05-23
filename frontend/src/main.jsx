import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PrototypeAlpha from "./pages/PrototypeAlpha";
import logo from "./assets/logo.png";
import "./index.css";
import "leaflet/dist/leaflet.css";

function Home() {
  return (
    <main className="app-shell">
      <div className="page-shell">
        <header className="topbar">
          <div className="brand-mark">
            <img src={logo} alt="Grama-AI logo" className="brand-mark__logo" />
            <div>
              <div className="eyebrow">Grama-AI</div>
              <div className="status">AI-assisted rural planning platform</div>
            </div>
          </div>
          <Link className="btn btn-secondary btn-small" to="/test">
            Open Prototype
          </Link>
        </header>

        <section className="home-hero">
          <div className="hero-card hero-card--home">
            <div className="hero-copy">
              <div className="eyebrow">Prototype ready</div>
              <h1 className="hero-title">
                A more professional planning UI for village-scale design and sustainability review.
              </h1>
              <p className="hero-subtitle">
                Explore an AI-generated village layout, review sustainability insights, and present a polished
                planning story with a cleaner dashboard experience.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary" to="/test">
                  Launch Prototype
                </Link>
                <a className="btn btn-secondary" href="#highlights">
                  View Highlights
                </a>
              </div>
            </div>
          </div>

          <aside className="hero-aside">
            <div className="metric-card">
              <div className="eyebrow">Focus</div>
              <div className="metric-value">Clarity</div>
              <div className="metric-label">Cleaner hierarchy, stronger contrast, and a more presentation-ready layout.</div>
            </div>
            <div className="metric-card">
              <div className="eyebrow">Scope</div>
              <div className="metric-value">Dashboard</div>
              <div className="metric-label">Designed to showcase village inputs, generated maps, and sustainability outcomes together.</div>
            </div>
          </aside>
        </section>

        <section className="feature-grid" id="highlights">
          <article className="feature-card">
            <h2>Refined visuals</h2>
            <p>Layered backgrounds, softer surfaces, and better spacing create a premium feel without overwhelming the content.</p>
          </article>
          <article className="feature-card">
            <h2>Better hierarchy</h2>
            <p>The most important actions now stand out clearly, making the app easier to scan in meetings and demos.</p>
          </article>
          <article className="feature-card">
            <h2>Consistent shell</h2>
            <p>The landing page and prototype now share the same visual language, so the product feels like one cohesive system.</p>
          </article>
        </section>
      </div>
    </main>
  );
}

const RootApp = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test" element={<PrototypeAlpha />} />
    </Routes>
  </BrowserRouter>
);

createRoot(document.getElementById("root")).render(<RootApp />);

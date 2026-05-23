import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function AccountPage() {
  const [displayName, setDisplayName] = useState("Guest Planner");
  const [email, setEmail] = useState("guest@grama-ai.local");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const payload = { displayName, email };
    const baseUrl = import.meta.env.VITE_AUTH_API_BASE_URL;

    try {
      if (baseUrl) {
        const response = await fetch(`${baseUrl.replace(/\/$/, "")}/account/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.detail || "Profile save failed");
        }
      }

      setStatus(
        baseUrl
          ? "Profile saved successfully."
          : "Demo profile ready. Connect VITE_AUTH_API_BASE_URL for live saves."
      );
    } catch (err) {
      setStatus(err.message || "Profile save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell auth-shell">
      <div className="page-shell auth-grid">
        <section className="auth-panel hero-card">
          <div className="brand-mark">
            <img src={logo} alt="Grama-AI logo" className="brand-mark__logo" />
            <div>
              <div className="eyebrow">Account</div>
              <div className="status">User profile placeholder</div>
            </div>
          </div>

          <h1 className="hero-title auth-title">Your account page is ready for future database integration.</h1>
          <p className="hero-subtitle">
            Use this page later for profile details, saved villages, preferences, and access control.
          </p>

          <div className="auth-actions">
            <Link className="btn btn-primary" to="/app">
              Open Workspace
            </Link>
            <Link className="btn btn-secondary" to="/login">
              Back to Login
            </Link>
          </div>
        </section>

        <form className="panel auth-form-panel" onSubmit={handleSave}>
          <div className="panel-header">
            <div>
              <div className="panel-title">Profile Snapshot</div>
              <div className="panel-description">Editable placeholder until your database is connected.</div>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-avatar">GA</div>
            <div>
              <div className="profile-name">Guest Planner</div>
              <div className="profile-meta">guest@grama-ai.local</div>
            </div>
          </div>

          <div className="field">
            <label>Display Name</label>
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="profile-list">
            <div>
              <span>Plan type</span>
              <strong>Village planning</strong>
            </div>
            <div>
              <span>Saved villages</span>
              <strong>0</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>Demo account</strong>
            </div>
          </div>

          <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
          {status && <div className="auth-status">{status}</div>}
        </form>
      </div>
    </main>
  );
}

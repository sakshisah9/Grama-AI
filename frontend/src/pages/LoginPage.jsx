import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const payload = { email, password };
    const baseUrl = import.meta.env.VITE_AUTH_API_BASE_URL;

    try {
      if (baseUrl) {
        const response = await fetch(`${baseUrl.replace(/\/$/, "")}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.detail || "Login failed");
        }
      }

      setStatus(
        baseUrl
          ? "Signed in successfully."
          : "Demo sign-in ready. Connect VITE_AUTH_API_BASE_URL for live auth."
      );
      navigate("/app");
    } catch (err) {
      setStatus(err.message || "Login failed");
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
              <div className="eyebrow">Grama-AI</div>
              <div className="status">Planning dashboard access</div>
            </div>
          </div>

          <h1 className="hero-title auth-title">Sign in to continue to the planning workspace.</h1>
          <p className="hero-subtitle">
            This is a clean login shell for your future database integration. For now it acts as the entry point into
            the prototype and account area.
          </p>

          <div className="auth-actions">
            <Link className="btn btn-primary" to="/app">
              Enter App
            </Link>
            <Link className="btn btn-secondary" to="/account">
              View Account
            </Link>
          </div>
        </section>

        <form className="panel auth-form-panel" onSubmit={handleSubmit}>
          <div className="panel-header">
            <div>
              <div className="panel-title">Login</div>
              <div className="panel-description">Ready to submit to your future auth API.</div>
            </div>
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
          {status && <div className="auth-status">{status}</div>}
        </form>
      </div>
    </main>
  );
}

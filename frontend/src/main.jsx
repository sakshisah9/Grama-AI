import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PrototypeAlpha from "./pages/PrototypeAlpha";
import "./index.css";
import "leaflet/dist/leaflet.css";

function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Grama-AI — Dev</h1>
      <Link className="text-blue-600 underline" to="/test">
        Go to Prototype Alpha
      </Link>
    </div>
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

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrototypeAlpha from "./pages/PrototypeAlpha";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import "./index.css";
import "leaflet/dist/leaflet.css";

const RootApp = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/app" element={<PrototypeAlpha />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

createRoot(document.getElementById("root")).render(<RootApp />);

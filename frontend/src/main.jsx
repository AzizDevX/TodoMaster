import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthLoginPage, AuthRegisterPage } from "./auth/auth.jsx";
import { Navigate } from "react-router-dom";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />}></Route>
        <Route path="/register" element={<AuthRegisterPage />}></Route>
        <Route path="/login" element={<AuthLoginPage />}></Route>
        <Route path="/home"></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

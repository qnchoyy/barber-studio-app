import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1f2937",
              color: "#fff",
              border: "1px solid #374151",
              fontSize: "14px",
              fontWeight: "500",
            },
            success: {
              duration: 5000,
              style: {
                background: "#065f46",
                color: "#d1fae5",
                border: "1px solid #10b981",
              },
            },
            error: {
              duration: 6000,
              style: {
                background: "#7f1d1d",
                color: "#fecaca",
                border: "1px solid #ef4444",
              },
            },
          }}
        />
      </BrowserRouter>
    </RecoilRoot>
  </StrictMode>
);

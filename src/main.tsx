// index.tsx or index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Analytics />
    <SpeedInsights />
    <App />
  </React.StrictMode>
);

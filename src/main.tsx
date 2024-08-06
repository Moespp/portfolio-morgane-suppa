import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/globals.css";
import Router from "./Router";

import initializei18n from "./libs/i18n";

initializei18n();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);

import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import App from "./App";
import { ThreadProvider } from "./hooks/use-thread";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThreadProvider>
      <App />
    </ThreadProvider>
  </React.StrictMode>
);


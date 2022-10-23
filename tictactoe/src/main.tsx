import React from "react";
import ReactDOM from "react-dom/client";
import Web3 from "web3";

import App from "./App";
import { AppStateProvider } from "./state";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppStateProvider provider={Web3.givenProvider}>
      <App />
    </AppStateProvider>
  </React.StrictMode>
);

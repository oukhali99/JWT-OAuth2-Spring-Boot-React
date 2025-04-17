import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./store";
import { Provider as ReduxProvider } from "react-redux";

const documentRoot = document.getElementById("root");
if (!documentRoot) throw new Error("Root element not found");

const root = ReactDOM.createRoot(documentRoot);
root.render(
  <ReduxProvider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ReduxProvider>,
);

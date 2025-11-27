import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // You can remove this or keep for basic styles
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css"; // If you prefer npm package for bootstrap
import "./styles/custom.css"; // Your custom styles

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

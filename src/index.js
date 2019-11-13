import React from "react";
import ReactDOM from "react-dom";
import { ProductProvider } from "./context";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./sass/index.scss";

ReactDOM.render(
  <ProductProvider>
    <Router>
      <App />
    </Router>
  </ProductProvider>,
  document.getElementById("root")
);

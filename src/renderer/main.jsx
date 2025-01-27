import {} from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./assets/style/normalize.css"

const root = createRoot(document.getElementById("app"));
root.render(<App />);

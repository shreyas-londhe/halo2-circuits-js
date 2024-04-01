import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Helmet, HelmetProvider } from "react-helmet-async";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <HelmetProvider>
            <Helmet>
                <meta
                    http-equiv="Cross-Origin-Opener-Policy"
                    content="same-origin"
                />
                <meta
                    http-equiv="Cross-Origin-Embedder-Policy"
                    content="require-corp"
                />
            </Helmet>
        </HelmetProvider>
        <App />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

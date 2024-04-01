import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import init, {
    initThreadPool,
    initPanicHook,
    Halo2Wasm,
    MyCircuit,
} from "./pkg/rust";

function App() {
    const [isRunning, setIsRunning] = useState(false);

    const runMain = async () => {
        setIsRunning(true);
        try {
            await init();
            initPanicHook();
            await initThreadPool(2);

            const halo2wasm = new Halo2Wasm();
            const myCircuit = new MyCircuit(halo2wasm);
            myCircuit.run();

            // Call any other necessary functions or operations

            console.log("Main function completed successfully");
        } catch (error) {
            console.error("Error running main function:", error);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <button onClick={runMain} disabled={isRunning}>
                    {isRunning ? "Running..." : "Run Main"}
                </button>
            </header>
        </div>
    );
}

export default App;

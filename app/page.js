"use client";

import React, { useState } from "react";

import init, {
    initThreadPool,
    initPanicHook,
    Halo2Wasm,
    MyCircuit,
} from "../rust/pkg/rust";

export default function Home() {
    const [isRunning, setIsRunning] = useState(false);

    const isAtomicsWaitAllowed = () => {
        try {
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 0);
            return true;
        } catch (e) {
            return false;
        }
    };

    const runMain = async () => {
        setIsRunning(true);
        try {
            await init();
            console.log("Wasm initialized");
            initPanicHook();
            console.log("Panic hook initialized");

            if (isAtomicsWaitAllowed()) {
                await initThreadPool(2);
                console.log("Thread pool initialized");
            } else {
                console.warn(
                    "Atomics.wait is not allowed in this context, multithreading disabled"
                );
            }

            const halo2wasm = new Halo2Wasm();
            console.log("Halo2Wasm instance created");
            const myCircuit = new MyCircuit(halo2wasm);
            console.log("MyCircuit instance created");
            myCircuit.run();
            console.log("MyCircuit run method called");

            let stats = halo2wasm.getCircuitStats();
            console.log("Circuit stats:", stats);

            // Call any other necessary functions or operations

            console.log("Main function completed successfully");
        } catch (error) {
            console.error("Error running main function:", error);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <main>
            <h1>Hello, World!</h1>
            <button onClick={runMain} disabled={isRunning}>
                {isRunning ? "Running..." : "Run Main"}
            </button>
        </main>
    );
}

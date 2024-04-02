"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
    const [isRunning, setIsRunning] = useState(false);
    const [wasmModule, setWasmModule] = useState(null);

    useEffect(() => {
        const isAtomicsWaitAllowed = () => {
            try {
                Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 0);
                return true;
            } catch (e) {
                return false;
            }
        };

        const loadWasmModule = async () => {
            try {
                const {
                    default: init,
                    initThreadPool,
                    initPanicHook,
                    Halo2Wasm,
                    MyCircuit,
                } = await import("../rust/pkg/rust");
                await init();
                initPanicHook();

                if (isAtomicsWaitAllowed()) {
                    await initThreadPool(2);
                } else {
                    console.warn(
                        "Atomics.wait is not allowed in this context, multithreading disabled"
                    );
                }

                setWasmModule({ Halo2Wasm, MyCircuit });
            } catch (error) {
                console.error("Error loading WASM module:", error);
            }
        };

        loadWasmModule();
    }, []);

    const runMain = async () => {
        setIsRunning(true);
        try {
            if (wasmModule) {
                const { Halo2Wasm, MyCircuit } = wasmModule;
                const halo2wasm = new Halo2Wasm();
                const myCircuit = new MyCircuit(halo2wasm);
                myCircuit.run();
                console.log("Main function completed successfully");
            } else {
                console.error("WASM module not loaded");
            }
        } catch (error) {
            console.error("Error running main function:", error);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <main>
            <h1>Hello, World!</h1>
            <button onClick={runMain} disabled={isRunning || !wasmModule}>
                {isRunning
                    ? "Running..."
                    : wasmModule
                    ? "Run Main"
                    : "Loading WASM..."}
            </button>
        </main>
    );
}

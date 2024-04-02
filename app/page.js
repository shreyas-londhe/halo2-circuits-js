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

    const fetchAndConvertToUint8Array = (url) => {
        return new Promise((resolve, reject) => {
            // Check if running in Node.js environment
            if (
                typeof process !== "undefined" &&
                process.versions &&
                process.versions.node
            ) {
                const https = require("https");
                https.get(url, (res) => {
                    let chunks = [];
                    res.on("data", (chunk) => chunks.push(chunk));
                    res.on("end", () => {
                        let binaryData = Buffer.concat(chunks);
                        resolve(new Uint8Array(binaryData));
                    });
                    res.on("error", reject);
                });
            }
            // Check if running in browser or web worker environment
            else if (
                typeof window !== "undefined" ||
                typeof self !== "undefined"
            ) {
                fetch(url)
                    .then((response) => response.arrayBuffer())
                    .then((buffer) => {
                        resolve(new Uint8Array(buffer));
                    })
                    .catch(reject);
            } else {
                reject(new Error("Environment not supported"));
            }
        });
    };

    const getKzgParams = async (k) => {
        if (k < 6 || k > 19) {
            throw new Error(`k=${k} is not supported`);
        }
        return await fetchAndConvertToUint8Array(
            `https://axiom-crypto.s3.amazonaws.com/challenge_0085/kzg_bn254_${k}.srs`
        );
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

            halo2wasm.config({
                k: 15,
                numAdvice: 1,
                numLookupAdvice: 1,
                numInstance: 1,
                numLookupBits: 14,
                numVirtualInstance: 1,
            });

            let stats = halo2wasm.getCircuitStats();
            console.log("Circuit stats:", stats);

            let params = await getKzgParams(15);
            console.log("KZG params:", params);

            halo2wasm.loadParams(params);
            console.log("KZG params loaded");

            halo2wasm.genVk();
            console.log("Verification key generated");

            halo2wasm.genPk();
            console.log("Proving key generated");

            let proof = halo2wasm.prove();
            console.log("Proof generated:", proof);

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

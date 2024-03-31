import {
    default as init,
    initThreadPool,
    initPanicHook,
    Halo2Wasm,
    MyCircuit,
} from "./pkg/wasm_halo2.js";

const main = async () => {
    if (typeof SharedArrayBuffer !== "function") {
        alert(
            "this browser does not have SharedArrayBuffer support enabled" +
                "\n\n" +
                msg
        );
        return;
    } else {
        console.log("SharedArrayBuffer support enabled");
    }
    await init();
    initPanicHook();
    await initThreadPool(2);
    const halo2wasm = new Halo2Wasm();
    const myCircuit = new MyCircuit(halo2wasm);
    myCircuit.run();
    console.log("myCircuit: ", myCircuit);
};

main().catch(console.error);

import {
    default as init,
    initThreadPool,
    initPanicHook,
    Halo2Wasm,
    MyCircuit,
} from "./pkg/wasm_halo2.js";

const main = async () => {
    await init();
    initPanicHook();
    await initThreadPool(2);
    const halo2wasm = new Halo2Wasm();
    const myCircuit = new MyCircuit(halo2wasm);
    myCircuit.run();
    console.log("myCircuit: ", myCircuit);
};

main().catch(console.error);

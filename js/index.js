import("../pkg/index.js")
    .then((module) => {
        module.init();
        module.initPanicHook();
        module.initThreadPool(2);
        const halo2wasm = new module.Halo2Wasm();
        const myCircuit = new module.MyCircuit(halo2wasm);
        myCircuit.run();
    })
    .catch(console.error);

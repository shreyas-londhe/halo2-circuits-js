mod utils;

use wasm_bindgen::prelude::*;
use web_sys::console::*;

use std::{ cell::RefCell, rc::Rc };

use halo2_wasm::{
    halo2_base::gates::{ circuit::builder::BaseCircuitBuilder, GateChip, GateInstructions },
    halo2lib::ecc::Bn254Fr as Fr,
    Halo2Wasm,
};

#[wasm_bindgen]
pub struct MyCircuit {
    // Add whatever other chips you need here
    gate: GateChip<Fr>,
    builder: Rc<RefCell<BaseCircuitBuilder<Fr>>>,
}

#[wasm_bindgen]
impl MyCircuit {
    #[wasm_bindgen(constructor)]
    pub fn new(circuit: &Halo2Wasm) -> Self {
        let gate = GateChip::new();
        MyCircuit {
            gate,
            builder: Rc::clone(&circuit.circuit),
        }
    }

    pub fn run(&mut self) {
        // Replace with your circuit, making sure to use `self.builder`
        let a = self.builder.borrow_mut().main(0).load_witness(Fr::from(1u64));
        let b = self.builder.borrow_mut().main(0).load_witness(Fr::from(2u64));
        self.gate.add(self.builder.borrow_mut().main(0), a, b);
    }
}

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn greet() {
    log_1(&"Hello from Rust".into());
}

#[wasm_bindgen]
pub fn get_rust_data() -> String {
    "Some data from Rust".into()
}

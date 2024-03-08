use wasm_bindgen::prelude::*;
use web_sys::console;

// // When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// // allocator.
// //
// // If you don't want to use `wee_alloc`, you can safely delete this.
// #[cfg(feature = "wee_alloc")]
// #[global_allocator]
// static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// // This is like the `main` function, except for JavaScript.
// #[wasm_bindgen(start)]
// pub fn main_js() -> Result<(), JsValue> {
//     // This provides better error messages in debug mode.
//     // It's disabled in release mode so it doesn't bloat up the file size.
//     #[cfg(debug_assertions)]
//     console_error_panic_hook::set_once();

//     // Your code goes here!
//     console::log_1(&JsValue::from_str("Hello world!"));

//     Ok(())
// }

use std::{ cell::RefCell, rc::Rc };

use halo2_base::{
    gates::{ circuit::builder::BaseCircuitBuilder, GateChip, GateInstructions },
    halo2_proofs::halo2curves::bn256::Fr,
};
use halo2_wasm::Halo2Wasm;
use wasm_bindgen::prelude::*;

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

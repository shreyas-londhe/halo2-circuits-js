use wasm_bindgen::prelude::*;
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
        let b = self.builder.borrow_mut().main(0).load_witness(Fr::from(69u64));
        let sum = self.gate.mul(self.builder.borrow_mut().main(0), a, b);

        self.builder.borrow_mut().assigned_instances[0].extend_from_slice(&[a, b, sum]);
    }
}

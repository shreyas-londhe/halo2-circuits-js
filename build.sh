#!/bin/bash

if [ "$1" = "wasm-gen" ]; then
  cd rust/
  wasm-pack build --target web
  cd ../
fi

npm run dev

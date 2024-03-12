#!/bin/bash
set -e

rm -rf pkg

TARGET=$1

if [ "$TARGET" = "nodejs" ]; then
  wasm-pack build --release --target nodejs --out-dir pkg --no-default-features
elif [ "$TARGET" = "web" ]; then
  wasm-pack build --release --target web --out-dir pkg
else
  echo "Target must be either 'web' or 'nodejs'"
  exit 1
fi

if [ "$TARGET" == "nodejs" ]; then
    sed -i '' "s/require('env')/{memory: new WebAssembly.Memory({initial: 100,maximum: 65536,shared: true,})}/g" pkg/index.js
fi

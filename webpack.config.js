const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    entry: "./bootstrap.js",
    ignoreWarnings: [
        /Circular dependency between chunks with runtime/,
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bootstrap.js",
    },
    mode: "development",
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "index.html" }, 
            ],
        }),
    ],
    experiments: {
        asyncWebAssembly: true,
    },
    // Required by wasm-bindgen-rayon, in order to use SharedArrayBuffer on the Web
    // Ref:
    //  - https://github.com/GoogleChromeLabs/wasm-bindgen-rayon#setting-up
    //  - https://web.dev/i18n/en/coop-coep/
    devServer: {
        headers: {
            'Cross-Origin-Embedder-Policy': 'require-corp',
            'Cross-Origin-Opener-Policy': 'same-origin',
        }
    },
};

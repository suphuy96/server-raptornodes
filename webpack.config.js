const path = require("path");
const nodeExternals = require("webpack-node-externals");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
module.exports = {
    mode: "production",
    entry: "./dist/server.js",
    module: {
        rules: [

            {
                test: /\.js?$/,
                use: "babel-loader",
                exclude: /node_modules/,
            }

        ],
    },
    resolve: {
        extensions: [ ".js" ],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname),
    },
    target: "node",
    externals: [nodeExternals()],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,

                uglifyOptions: {
                    compress: false,
                    ecma: 6,
                    mangle: true,
                    warnings: false,
                    output: {
                        comments: false
                    }
                },
                sourceMap: false
            })
        ]
    },
};

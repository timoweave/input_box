var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: [
        "./palindrome.jsx"
    ],
    output: {
        path: __dirname,
        filename: "palindrome.bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.(jpe?g|png|gif|svg)$/i, loader:'url' },
            { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.template.html'
        })
    ]
};

const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
            "@joint-editing/diff-library": path.resolve(__dirname, '../diff-library/src'),
            "@joint-editing/websocket-library": path.resolve(__dirname, '../webSocket-library/src'),
        }
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html',
        }),
        new CleanWebpackPlugin(),
    ],
};

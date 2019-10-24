const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/app.tsx',
    plugins: [
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['../.build/frontend']
        }),
        new HtmlWebpackPlugin({
            template: 'src/templates/index.html'
        }),
    ],
    output: {
        path: __dirname + '/../.build/frontend',
        filename: 'main.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: [
            path.resolve('./node_modules'),
            path.resolve('./src')
        ]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' },
            { test: /\.(png|jpe?g|gif|svg)$/i, loader: 'file-loader'},
            { test: /\.css/, loaders: ['style-loader', 'css-loader'] }
        ]
    },
    optimization: {
        minimize: false
    },
};
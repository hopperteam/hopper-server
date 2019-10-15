const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' },
            { test: /\.(png|jpe?g|gif|svg)$/i, loader: 'file-loader'}
        ]
    }
};
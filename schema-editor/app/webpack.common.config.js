var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var outputPath = '/usr/dist';

module.exports = {
    entry: {
        app: ['babel-polyfill', './js/src/main.js'],
        vendor: [
            'axios',
            'jquery'
        ],
    },
    output: {
        path: outputPath,
        publicPath: '/',
        filename: '[name].bundle.[hash].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Ashlar Blueprint Schema Editor',
            filename: 'schema-editor.html',
            template: 'templates/schema-editor.html',
            inject: 'body',
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|lib)/,
                loader: 'babel-loader',
            },
            {
                test: /\.js?/,
                exclude: /(node_modules|lib|json)/,
                loader: 'eslint-loader',
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'resolve-url-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [require('autoprefixer')]
                        }
                    },
                ],
            },
            {
                test: /fonts.*\.(woff|woff2|ttf|eot|svg)($|\?)/,
                loader: 'url-loader?limit=25000&name=font/[name].[ext]',
            },
            {
                test: /(img|images).*\.(jpg|png|gif|svg)$/,
                loader: 'url-loader?limit=25000&name=img/[name].[ext]',
            },
            {
                test: /.*\.(json)$/,
                exclude: /node_modules/,
                loader: 'json-loader',
            },
            {
                test: /\.(html)$/,
                loader: 'html-loader?name=[name].[ext]',
            },
        ],
    },
    resolve: {
        extensions: ['.js'],
        modules: ['common', 'node_modules', 'img', 'js'],
    },
    node: {
        fs: 'empty',
    },
    devServer: {
        disableHostCheck: true,
        historyApiFallback: {
            index: '/',
        }
    },
};

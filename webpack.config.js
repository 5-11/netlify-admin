const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

module.exports = {
    /*entry: [
        'webpack-dev-server/client?http:://localhost:8080',
        'webpack/hot/only-dev-server',
        './Client/Js/index.js'
    ],*/
    entry: './Client/Js/index.js',
    output: {
        path: '/build/Client',
        filename: "bundle.[hash].js",
        publicPath: '/'
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx', '.graphql'],
    },
    devtool: 'inline-source-map',
    module: {
        /*loaders: [
            {
                test: /\.js$/,
                loaders: ['react-hot', 'babel'],
                include: './Client'
            },
            {
                test: /\.css$/,
                loader: "style!css"
            }
        ],*/
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules|Client\/vendor/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["env", "react"],
                        plugins: ["react-hot-loader/babel", "transform-object-rest-spread", "transform-class-properties"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            camelCase: true,
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: true }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebPackPlugin({
            template: "./Client/index.html",
            filename: "index.html"
        }),
        /*new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })*/
    ],
    devServer: {
        contentBase: './Client',
        hot: true,
        historyApiFallback: true
    }
};
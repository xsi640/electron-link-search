const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    target: 'electron',
    entry: ['./src/renderer/index.js'], //入口
    output: { //输出
        path: __dirname,
        publicPath: '../',
        filename: './public/bundle.js'
    },
    resolve: {
        modules: ['node_modules'], //node_modules用于搜索模块的目录
        alias: {}, //别名
        extensions: ['.js', '.jsx'] //用于自动处理某些扩展名
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                loader: 'babel-loader',
                options: {
                    presets: ['react', 'es2015', 'stage-0']
                },
                exclude: /node_modules/
            }, {
                test: /\.(scss|css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader', 'postcss-loader']
                })
            }, {
                test: /\.(jpg|png|gif)$/,
                loader: "url-loader",
                query: {
                    limit: 8196,
                    name: './public/images/[hash].[ext]'
                }
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 4096,
                    name: './public/fonts/[hash].[ext]'
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false, //移除注释
            },
            compress: { //压缩脚本
                warnings: false,
                drop_console: false
            }
        }),
        new ExtractTextPlugin('public/styles.css'), //输出css
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            options: {
                postcss: [autoprefixer]
            }
        })
    ],
    devtool: process.env.NODE_ENV === 'production'
        ? undefined
        : 'cheap-module-eval-source-map'
};

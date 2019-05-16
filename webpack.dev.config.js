const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry:'./src/app.js',
    mode:"development",
    plugins:[
        new HtmlWebpackPlugin({
            template:'./index.html'
        })
    ],
    devServer:{
        contentBase:path.join(__dirname,'./dist'),
        open:true, //自动打开浏览器
        port: 9000
    },
    module:{
        rules:[{
            test:/\.js?$/,
            exclude:/(node_modules)/,
            loader:'babel-loader'
        }]
    },
    output:{
        path:__dirname,
        filename:'./dist/bundle.js'
    }
}
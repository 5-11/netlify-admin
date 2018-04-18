const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');

new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    proxy: {
        "/graphql": "http://localhost:4000"
    }
}).listen(8080, 'localhost', function (error) {
    if(error) {
        return console.log(error);
    }
    console.log('webpack dev server is listening at http://localhost:8080/');
});
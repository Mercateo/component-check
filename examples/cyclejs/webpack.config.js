var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    path: './dist',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // example: https://github.com/ampedandwired/html-webpack-plugin/blob/master/default_index.html
      template: './src/index.html'
    }),
    new ExtractTextPlugin('styles.css')
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: './dist'
  }
};

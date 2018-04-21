const { resolve } = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = merge.strategy({
  plugins: 'replace',
  'module.rules': 'replace'
})(common, {
  output: {
    filename: '[name].[hash:5].js',
    chunkFilename: '[name].[hash:5].bundle.js',
    pathinfo: false
  },
  devtool: false,
  bail: true,
  module: {
    rules: [
      {
        test: /\.(jsx?|ts)$/,
        include: resolve(__dirname, './src'),
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        rules: [
          {
            exclude: resolve(__dirname, './src'),
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    minimize: true
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    ident: 'postcss',
                    plugins: () => [require('autoprefixer')()]
                  }
                }
              ]
            })
          },
          {
            include: resolve(__dirname, './src'),
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: false,
                    minimize: {
                      discardComments: { removeAll: true }
                    },
                    importLoaders: 1,
                    camelCase: 'dashesOnly',
                    modules: true,
                    localIdentName: '[hash:base64:5]'
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    ident: 'postcss',
                    plugins: () => [require('autoprefixer')()]
                  }
                }
              ]
            })
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: resolve(__dirname, './dist/index.html'),
      template: './public/index.html',
      minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true
      }
    }),
    new ExtractTextPlugin('[contenthash:base64:5].css')
  ]
});

module.exports = config;

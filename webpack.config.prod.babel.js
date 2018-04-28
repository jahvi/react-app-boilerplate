import { resolve } from 'path';
import { strategy } from 'webpack-merge';
import common from './webpack.config.babel.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin, { extract } from 'extract-text-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const isAnalyze = process.argv.includes('--env.analyze');

const config = strategy({
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
            use: extract({
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
            use: extract({
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
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    }),
    new ExtractTextPlugin('[name].[contenthash:base64:5].css'),
    ...(isAnalyze ? [new BundleAnalyzerPlugin()] : [])
  ]
});

export default config;

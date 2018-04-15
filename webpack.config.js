const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = (env, arg) => {
  return {
    entry: './src/index.js',
    output: {
      path: resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      pathinfo: !(arg.mode === 'production')
    },
    devtool: arg.mode === 'production' ? false : 'eval-source-map',
    bail: arg.mode === 'production',
    module: {
      rules: [
        {
          test: /\.(jsx?|ts)$/,
          include: resolve(__dirname, './src'),
          loader: 'babel-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: resolve(__dirname, './dist/index.html'),
        template: './public/index.html'
      })
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'initial'
          }
        }
      },
      runtimeChunk: true
    }
  };
};

module.exports = config;

import { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const isAnalyze = process.argv.includes('--env.analyze');

const config = {
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].bundle.js',
    pathinfo: true
  },
  devtool: 'eval-source-map',
  bail: false,
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(jsx?|ts)$/,
        include: resolve(__dirname, './src'),
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader',
        rules: [
          {
            exclude: resolve(__dirname, './src'),
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  minimize: false
                }
              }
            ]
          },
          {
            include: resolve(__dirname, './src'),
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  minimize: false,
                  importLoaders: 1,
                  camelCase: 'dashesOnly',
                  modules: true,
                  localIdentName: '[name]-[local]-[hash:base64:5]'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: resolve(__dirname, './dist/index.html'),
      template: './public/index.html'
    }),
    ...(isAnalyze ? [new BundleAnalyzerPlugin()] : [])
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

export default config;

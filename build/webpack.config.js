const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const vueLoaderConfig = require('./vue-loader.conf');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../packages/spreadjs/lib'),
    publicPath: './',
    filename: 'index.js',
    chunkFilename: '[id].js',
    // libraryExport: 'default',
    // library: 'ELE-SREADJS',
    library: '',
    libraryTarget: 'commonjs2'
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              targets: {
                browsers: ['last 2 versions', 'not ie <= 10']
              }
            }
            ]
          ],
          plugins: [
            ['@babel/transform-runtime', {
              corejs: 3,
            }],
            ["import", {
              "libraryName": "iview",
              "libraryDirectory": "src/components"
            }]
          ]
        }
      },
      {
        test: /\.less$ /,
        loaders: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.scss$ /,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new VueLoaderPlugin()
  ]
}

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const Dotenv = require('dotenv-webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { DefinePlugin } = require('webpack')
const { SourceMapDevToolPlugin } = require('webpack')

const normalizeName = name => {
  return name.replace(/node_modules/g, 'nodemodules')
    .replace(/[\-_.|]+/g, '')
    .replace(/\b(vendors|nodemodules|js|modules|es)\b/g, '')
    .trim()
    .replace(/ +/g, '-')
}

let ASSET_PATH = process.env.CLIENT_ASSETS_URL_PATH ?? '/client-bundles/'

if (ASSET_PATH.charAt(0) !== '/') {
  ASSET_PATH = '/' + ASSET_PATH
}

if (!ASSET_PATH.endsWith('/')) {
  ASSET_PATH += '/'
}

ASSET_PATH = (process.env.CLIENT_ASSETS_URL_BASE ?? '') + ASSET_PATH

module.exports = {
  entry: {
    index: './src/client/index.js',
    libraries: './public/js/client-entries/libraries.js',
    'app-ready': './public/js/client-entries/app-ready.js',
    'low-priority': './public/js/client-entries/low-priority.js',
    appinsights: './public/js/appinsights.js',
    'environment-setup': './public/js/environment-setup.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.join(__dirname, '../public/client-bundles/'),
    publicPath: ASSET_PATH
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
        }
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['ramda', 'transform-vue-jsx']
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /module.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.module.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[hash:base64:5]__[name]__[local]'
              },
              localsConvention: 'camelCase'
            }
          },
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [path.resolve('src/client/styles/framework/index.scss')]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
    ]
  },
  plugins: [
    // This makes it possible for us to safely use env vars on our code
    new DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
    }),
    new CleanWebpackPlugin(),
    new NodePolyfillPlugin(),
    new MiniCssExtractPlugin({
      filename:"[name].[contenthash].css"
    }),
    new VueLoaderPlugin(),
    new Dotenv({
      path: './.env.client',
      safe: '.env.client.example',
    }),
    new WebpackManifestPlugin({}),
    new SourceMapDevToolPlugin({
      filename: '[file].map'
    })
  ],
  optimization: {
    minimize: true,
    splitChunks: {
      name(module) {
        const moduleFileName = module.identifier().split('/').reduceRight(item => item)
        return normalizeName(moduleFileName.replace(/[\/]/g, '-'))
      }
    }
  },
  externals: {
    // define module 'vue' which will point to window.Vue in result bundle
    vue: 'Vue'
},
  resolve: {
    alias: {
      '@': path.resolve('src/client')
    }
  }
}

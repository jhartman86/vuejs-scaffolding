// Ensure environment defaults to 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.HTTP_PORT = process.env.HTTP_PORT || 8080;
process.env.HTTP_PORTS = process.env.HTTP_PORTS || 4433;

const fs = require('fs');
const path = require('path');
const babelRc = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'));
const packageJSON = require('./package.json');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractableSourcePlugin = require('./support/extractSrcPlugin');

/**
 * Devlopment or something else?
 */
const isDev = process.env.NODE_ENV === 'development';

/**
 * Create text extractor to pull out styles into own file (production only).
 */
const extractScss = new ExtractTextPlugin('style.css');

/**
 * 'Dist' path for compiled files. Changes depending on whether dev or production,
 * but always nested under ./_dist.
 */
const distPath = path.resolve('./_dist', isDev ? 'dev' : 'release');

/**
 * This plugin is responsible for extracting all html templates that are
 * included in the bundle via require('whatever.html'); and makes them
 * available to the HtmlWebpackPlugin for injecting into the index.html template.
 */
const extractableHtml = new ExtractableSourcePlugin({
  getTemplateId(fileName) {
    return fileName.replace(`${path.resolve(__dirname, 'src')}/`, '')
      .replace(`/${path.basename(fileName)}`, '')
      .split('/')
      .join('-')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }
});

/**
 * Handles writing index.html file, and injecting bundle.js + the extracted CSS
 * file. Note when running in development: the CSS file *will not* be extracted to
 * its own file, but instead served from memory.
 */
const makeIndexHtml = new HtmlWebpackPlugin({
  title: packageJSON.name,
  template: path.resolve(__dirname, './src/index.html'),
  alwaysWriteToDisk: true,
  cache: false,
  minify: isDev ? {} : {
    collapseWhitespace: true, removeComments: true
  }
});

/**
 * In order to view the original ES6 code in sourcemaps, use 
 * devtool: 'source-map'. In order to view the *transformed* by Babel
 * and webpack source mapped code, use 'cheap-source-map'. Defaulting
 * to 'cheap-source-map' in order to display a more accurate representation
 * of what the transformed result is...
 */
const devtool = isDev ? 'cheap-source-map' : 'source-map';

/**
 * Main webpack config.
 */
module.exports = {
  devtool,
  entry: isDev ? ['./support/dev-client.js', './src/entry.js'] : './src/entry.js',
  output: {
    path: distPath,
    filename: 'entry.js'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'modernizr$': path.resolve(__dirname, './.modernizrrc')
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, './src'), path.resolve(__dirname, './test')],
        loader: 'eslint-loader',
        options: {
          emitError: false
        }
      },
      {
        test: /\.scss$/,
        loader: isDev ? ['style-loader', 'css-loader', 'sass-loader'] :
          extractScss.extract({
            use: ['css-loader', 'sass-loader']
          })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: Object.assign({}, babelRc, {
          cacheDirectory: true
        })
      },
      {
        test: /\.html$/,
        include: [ path.resolve(__dirname, './src') ],
        exclude: [ path.resolve(__dirname, './src/index.html') ],
        loader: extractableHtml.extract()
      },
      {
        test: /\.modernizrrc$/,
        loader: 'modernizr-loader!json-loader'
      }
    ]
  },
  stats: {
    chunks: isDev ? false : true,
    modules: isDev ? false : true,
    maxModules: 100
  },
  performance: {
    hints: isDev ? false : 'warning'
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    hot: true,
    inline: false,
    clientLogLevel: 'none',
    compress: true,
    contentBase: distPath,
    stats: {
      colors: true,
      chunks: false
    },
    watchOptions: {
      ignored: /node_modules/
    },
    serverSideRender: false
  }
};

/**
 * Always use these plugins.
 */
module.exports.plugins = [
  extractScss,
  extractableHtml,
  makeIndexHtml,
  new HtmlWebpackHarddiskPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(isDev ? 'development' : 'production'),
      VERSION: packageJSON.version
    }
  })
];

/**
 * Dev only plugins.
 */
if (isDev) {
  module.exports.plugins = module.exports.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]);
}

/**
 * Production plugins.
 */
if (!isDev) {
  module.exports.plugins = module.exports.plugins.concat([
    // Copy assets to release directory
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, './assets'),
      to: path.resolve(distPath, './assets')
    }]),
    // Minify javascript bundle
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({minimize: true})
  ]);
}


process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const fs   = require('fs');
const path = require('path');
const babelRc   = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'));
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractableSourcePlugin = require('./support/extractSrcPlugin');
const extractScss = new ExtractTextPlugin('style.css');
const isDev = process.env.NODE_ENV === 'development';
const distPath = path.resolve('./_dist', isDev ? 'dev' : 'release');
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
const makeIndexHtml = new HtmlWebpackPlugin({
  title: require('./package.json').name,
  template: './index.html',
  alwaysWriteToDisk: true,
  cache: false,
  minify: isDev ? {} : {
    collapseWhitespace: true, removeComments: true
  }
});

module.exports = {
  entry: isDev ? ['./support/dev-client.js', './src/entry.js'] : './src/entry.js',
  output: {
    path: distPath,
    filename: 'entry.js'
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
        loader: extractableHtml.extract()
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devtool: '#eval-source-map',
  // stats: isDev ? 'minimal' : 'normal',
  stats: {
    chunks: isDev ? false : true,
    modules: isDev ? false : true,
    maxModules: 100
  },
  performance: {
    hints: isDev ? false : 'warning'
  },
  devServer: {
    host: '127.0.0.1',
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

module.exports.plugins = [
  extractScss,
  extractableHtml,
  makeIndexHtml,
  new HtmlWebpackHarddiskPlugin()
];

if (isDev) {
  module.exports.plugins = module.exports.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]);
}

if (!isDev) {
  module.exports.devtool = '#source-map';
  module.exports.plugins = module.exports.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}


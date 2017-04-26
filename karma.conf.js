const path = require('path');
const webpackConfig = require('./webpack.config');
const browsers = [
  'Chrome'
];

// expressApp.use(express.static(dirPath('./node_modules/mocha')));

module.exports = (config) => {
  config.set({
    basePath: path.resolve(__dirname, './'),
    browsers,
    files: ['./test/manifest.js'],
    frameworks: ['mocha'],
    preprocessors: {
      './test/manifest.js': ['webpack']
    },
    reporters: ['mocha', /*'coverage'*/],
    webpack: webpackConfig,
    webpackMiddleware: webpackConfig.devServer,
    client: {
      captureConsole: true,
      clearContext: false,
      mocha: {
        reporter: 'html',
        ui: 'bdd'
      }
    }
  });
};
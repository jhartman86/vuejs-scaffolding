const path = require('path');
const webpackConfig = require('./webpack.config');
const browsers = [
  'Chrome',
  'Firefox'
];

module.exports = (config) => {
  config.set({
    basePath: path.resolve(__dirname, './'),
    browsers,
    files: ['./test/manifest.js'],
    frameworks: ['mocha'],
    preprocessors: {
      './test/manifest.js': ['webpack']
    },
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      type: 'text-summary'
    },
    webpack: webpackConfig,
    webpackMiddleware: webpackConfig.devServer,
    customContextFile: '_dist/test/context.karma.html',
    client: {
      captureConsole: true,
      clearContext: false,
      mocha: {
        reporter: 'html',
        ui: 'bdd'
      }
    },
    colors: true,
    singleRun: true,
    concurrency: Infinity
  });
};
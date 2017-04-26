const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const compiler = webpack(webpackConfig);
const HOST_PORT = 8080;
const HOST_NAME = '0.0.0.0';

/**
 * Setup the express app and bind webpack middlewares
 */
const app = new express();
const devMiddleware = require('webpack-dev-middleware')(compiler, webpackConfig.devServer);
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  path: '/_hmr'
});

/**
 * If any file *except* a SCSS file was changed (JS or HTML templates),
 * then force the browser to refresh. Not tryna' make this use hot module
 * reloading.
 */
let shouldRefresh = false;
compiler.plugin('watch-run', (watching, done) => {
  const mtimes = watching.compiler.watchFileSystem.watcher.mtimes || {};
  shouldRefresh = !!Object.keys(mtimes).filter(key => {
    return path.extname(key) !== '.scss';
  }).length;
  done();
});
compiler.plugin('done', () => {
  shouldRefresh && hotMiddleware.publish({action:'reload'});
  shouldRefresh = false;
});

/**
 * Bind middlewares, and lastly always return index.html for any
 * routes that aren't explicitly caught.
 */
app.use(express.static(webpackConfig.devServer.contentBase));
app.use('/assets', express.static('assets'));
app.use(devMiddleware);
app.use(hotMiddleware);

/**
 * Hit localhost:8080/test to run the tests in the browser. Note, the
 * bundle request is returned rom webpack in memory.
 */
// app.use(express.static(path.resolve(__dirname, '../node_modules/mocha')));

/**
 * Single page apps should return index.html always.
 */
app.get('/*', (req, res) => {
  res.sendFile(`${webpackConfig.devServer.contentBase}/index.html`);
});

/**
 * Launch that business.
 */
app.listen({port:HOST_PORT, hostname:HOST_NAME}, () => {
  console.log(`-- Listening on //${HOST_NAME}:${HOST_PORT}\n`);
});;


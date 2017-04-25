const path = require('path');
const express = require('express');
const webpack = require("webpack");
const webpackConfig = require("../webpack.config");
const compiler = webpack(webpackConfig);

const app = new express();
const devMiddleware = require('webpack-dev-middleware')(compiler, webpackConfig.devServer);
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  path: '/_hmr'
});

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

app.use(express.static(webpackConfig.devServer.contentBase));
app.use(devMiddleware);
app.use(hotMiddleware);
app.get('/*', (req, res) => {
    res.sendFile(`${webpackConfig.devServer.contentBase}/index.html`);
});

app.listen({port:8080, hostname: '0.0.0.0'}, () => {
    console.log('-- Listening on //0.0.0.0:8080');
});;


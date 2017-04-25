const htmlMinifier = require('html-minifier').minify;
const minifyOpts   = {collapseWhitespace: true, removeComments: true};

module.exports = ExtractSrcPlugin;

function ExtractSrcPlugin(options) {
  this.options = options;
}

ExtractSrcPlugin.prototype.apply = function (compiler) {
  const getTemplateId = this.options.getTemplateId || function (fileName) {
    return fileName;
  };

  const emitted = new Promise((resolve, reject) => {
    const templates = {};
    compiler.plugin('emit', (compilation, callback) => {
      compilation.modules.forEach(m => {
        if (m.__extractedSource) {
          templates[m.resource] = m.__extractedSource;
        }
      });
      resolve(templates);
      callback();
    });
  });

  compiler.plugin('compilation', compilation => {
    compilation.plugin('html-webpack-plugin-before-html-generation', (htmlPluginData, callback) => {
      emitted.then(mappings => {
        const templates = [];
        for(let resourcePath in mappings) {
          templates.push(
            `<script type="text/x-template" id="${getTemplateId(resourcePath)}">${htmlMinifier(mappings[resourcePath], minifyOpts)}</script>`
          );
        }
        htmlPluginData.plugin.options.vueTemplates = templates;
        callback(null, htmlPluginData);
      });
    });
  });

  // compiler.plugin('compilation', compilation => {
  //   const _sources = new Promise((resolve, reject) => {
  //     const templates = {};
  //     compilation.plugin('optimize-tree', (__, modules, callback) => {
  //       modules.forEach(normalModule => {
  //         if (normalModule.__extractedSource) {
  //           console.log('\nEXTRACTED SOURCE: ', normalModule.__extractedSource);
  //           templates[normalModule.resource] = normalModule.__extractedSource;
  //         }
  //       });
  //       resolve(templates);
  //       callback();
  //     });
  //   });

  //   compilation.plugin('html-webpack-plugin-before-html-generation', (htmlPluginData, callback) => {
  //     _sources.then(mappings => {
  //       const templates = [];
  //       for(let resourcePath in mappings) {
  //         const id = getTemplateId(resourcePath);
  //         const html  = htmlMinifier(mappings[resourcePath], {
  //           collapseWhitespace: true, removeComments: true
  //         });
  //         templates.push(
  //           `<script type="text/x-template" id="${id}">${html}</script>`
  //         );
  //       }
  //       console.log('\n\n here with: ', templates, '\n---------\n');
  //       htmlPluginData.plugin.options.vueTemplates = templates;
  //       callback(null, htmlPluginData);
  //     });
  //   });
  // });
};


ExtractSrcPlugin.prototype.extract = function () {
  return {loader: require.resolve('./loader')};
};
ExtractSrcPlugin.extract = ExtractSrcPlugin.prototype.extract.bind(ExtractSrcPlugin);



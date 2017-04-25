// require all index.js files (except this one) in sub directories
const context = require.context('./', true, /index.js$/);
const exportable = {};
context.keys()
  .filter(path => { return path !== './index.js'; })
  .forEach(path => {
    const name = path.replace('/index.js', '').replace('./', '');
    const module = context(path);
    exportable[name] = module.default ? module.default : module; // es6/commonJS interop
  });

export default exportable;
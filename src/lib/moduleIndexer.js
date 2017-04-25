/**
 * Webpack gives us a lovely way to find and require() all the
 * child JS modules in a given directory context. This makes it easy to
 * put an index.js at the root of a directory like 'components', and
 * when require()ing components get a list of all components vs
 * having to enumerate them individually. This handles normalizing names
 * from any resolved files in nested directories, making
 *  ./my/child/something/index.js -> myChildSomething
 * 
 * eg, we can do:
 * --------------------------------------------------------
 *  import helpers from './helpers';
 *  helpers.someModule(...)
 *  helpers.anotherModule(...)
 * vs
 *  import myHelperModule from './helpers/myHelperModule'
 *  import anotherOne from './helpers/anotherOne'
 *  myHelperModule(...)
 *  anotherOne(...)
 * --------------------------------------------------------
 * Notably - this *also* lets us enumerate all the submodules in a
 * given directory. eg:
 *  modules.forEach(m => { doSomethingWith(m) })
 * 
 * @param {*} context require.context instance
 */
export default function (context) {
  const exportable = {};
  context.keys()
    .filter(path => { return path !== './index.js'; })
    .forEach(path => {
      const name = path
        .replace('./', '')
        .replace('index.js', '')
        .replace('.js', '')
        .split('/')
        .map((word, index) => {
          return index === 0 ? 
            word : word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join('');
      const module = context(path);
      exportable[name] = module.default ? module.default : module; // es6/commonJS interop
    });
  return exportable;
}
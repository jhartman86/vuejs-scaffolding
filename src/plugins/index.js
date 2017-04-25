import moduleIndexer from '@/lib/moduleIndexer';
const context = require.context('./', true, /index.js$/);
const modules = moduleIndexer(context);
export default modules;
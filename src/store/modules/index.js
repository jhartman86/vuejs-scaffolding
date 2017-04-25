import moduleIndexer from '@/lib/moduleIndexer';
const context = require.context('./', true, /.js$/);
const modules = moduleIndexer(context);
export default modules;
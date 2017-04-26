// Require all .test.js files
const context = require.context('./', true, /.test.js$/);
context.keys().forEach(context);
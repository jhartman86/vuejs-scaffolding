// Bundle mocha
require('mocha/mocha');

// Initialize
mocha.setup('bdd');
// Execute once all scripts are loaded
document.addEventListener('DOMContentLoaded', function () {
  mocha.run();
});

// Require all .test.js files
const context = require.context('./', true, /.test.js$/);
context.keys().forEach(context);
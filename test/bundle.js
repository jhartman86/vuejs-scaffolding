// Bundle mocha
require('mocha/mocha');

// Initialize
mocha.setup('bdd');
// Execute once all scripts are loaded
document.addEventListener('DOMContentLoaded', function () {
  mocha.run();
});

// Require all tests in the suite
require('./manifest');
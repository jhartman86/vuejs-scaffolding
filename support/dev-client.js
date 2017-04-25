// https://github.com/vuejs-templates/webpack/blob/master/template/build/dev-client.js
// require('eventsource-polyfill');
const hotClient = require('webpack-hot-middleware/client?path=/_hmr&noInfo=true');

hotClient.subscribe(event => {
  event.action === 'reload' && window.location.reload();
});

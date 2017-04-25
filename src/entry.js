import Vue from 'vue';
import plugins from '@/plugins';
import components from '@/components';
import store from '@/store';

/**
 * Bind all components to the Vue instance.
 */
Object.keys(components).forEach(k => {
  Vue.component(components[k].name, components[k]);
});

/**
 * Bind all plugins.
 */
Object.keys(plugins).forEach(k => {
  Vue.use(plugins[k]);
});

/**
 * Mount the app, specifying which top level component to use.
 */
new Vue({
  store,
  render: h => h(Vue.component('pageHome'))
}).$mount('#app');

/**
 * Include app.scss into the bundle.
 */
require('./app.scss');
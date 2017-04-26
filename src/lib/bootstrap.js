import Vue from 'vue';
import plugins from '@/plugins';
import components from '@/components';
import getStore from '@/store';

/**
 * For testing, export the makeInstance function to generate
 * fresh app instances and stores.
 */
export { makeInstance };

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
 * Create an app instance.
 */
function makeInstance(defaults = {}) {
  return new Vue(Object.assign({}, defaults, {
    store: getStore()
  }));
}
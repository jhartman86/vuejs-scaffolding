require('./app.scss');
import Vue from 'vue';
import { makeInstance } from '@/lib/bootstrap';


/**
 * Mount the app, specifying which top level component to use.
 */
makeInstance({
  render: h => h(Vue.component('pageHome'))
}).$mount('#app');
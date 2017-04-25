import Vue from 'vue';
import components from '@/components';

Object.keys(components).forEach(k => {
  Vue.component(components[k].name, components[k]);
});

new Vue({
  render: h => h(Vue.component('pageHome'))
}).$mount('#app');
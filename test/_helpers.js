import Vue from 'vue';
import { makeInstance } from '@/lib/bootstrap';
export { makeIsolatedComponent };
const noop = () => {};

function makeIsolatedComponent(componentName, ready, onDestroy = noop) {
  let div = document.createElement('div');
  document.body.appendChild(div);

  makeInstance({
    render: h => h(Vue.component(componentName), {ref:'component'}),
    mounted() {
      ready(this, this.$refs.component);
    },
    destroyed() {
      this.$el.parentNode.removeChild(this.$el);
      this.$el = this.$store = div = null;
      onDestroy();
    }
  }).$mount(div);
}
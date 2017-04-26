require('./view.html'); require('./style.scss');

export default {
  name: 'demoBox',
  template: '#components-demo-box',
  props: ['link'],
  data() {
    return {
      target: '_blank'
    };
  }
};
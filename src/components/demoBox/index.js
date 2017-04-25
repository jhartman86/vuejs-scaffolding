require('./view.html'); require('./style.scss');

export default {
  name: 'demoBox',
  template: '#components-messager',
  props: ['link'],
  data() {
    return {
      target: '_blank'
    };
  }
};
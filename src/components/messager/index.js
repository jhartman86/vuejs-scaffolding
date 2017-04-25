require('./view.html'); require('./style.scss');

export default {
  name: 'messager',
  template: '#components-messager',
  data() {
    return {
      display: 'Hey from Messager!'
    };
  }
};
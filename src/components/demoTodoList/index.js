require('./view.html'); require('./style.scss');

export default {
  name: 'demoTodoList',
  template: '#components-demo-todo-list',
  data() {
    return {
      newItem: null
    };
  },
  methods: {
    create() {
      this.$store.dispatch('LIST.ADD', this.newItem);
      this.newItem = null;
    },
    purge(index) {
      this.$store.dispatch('LIST.REMOVE', index);
    }
  }
};
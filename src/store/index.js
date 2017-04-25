import Vue from 'vue';
import Vuex from 'vuex';
import modules from '@/store/modules';

// Bind plugin to Vue instance
Vue.use(Vuex);

// Create store
const store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV === 'production'
});

export default store;
import Vue from 'vue';
import Vuex from 'vuex';
import modules from '@/store/modules';

// Bind plugin to Vue instance
Vue.use(Vuex);

/**
 * Only ever use this once during normal app creation (store gets
 * injected into the root Vue instance, and becomes available to
 * all components). BUT - for testing, we want to be able to create
 * fresh app instances with fresh stores, hence this acts more as a
 * store factory.
 */
export default function getStore() {
  return new Vuex.Store({
    modules,
    strict: process.env.NODE_ENV === 'production'
  });
}
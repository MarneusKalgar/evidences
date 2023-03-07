import Vue from 'vue';
import { storeFabric } from '../../vendor';
import createStore from './store';
import Root from './views/index.vue';

const storeConfig = createStore();
const store = storeFabric(storeConfig);

store.subscribe(mutation => console.log('mutation:', mutation.type, mutation.payload));
store.subscribeAction(action => console.log('action:', action.type, action.payload));

new Vue({
  el: '#app',
  render: h => h(Root),
  store
});

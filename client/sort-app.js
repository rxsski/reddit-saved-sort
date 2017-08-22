import Vue from 'vue';
import AppComponent from './viewmodels/App/index.vue';

const vm = new Vue({
  el: '#app',
  components: {
    app: AppComponent
  },
  render: h => h('app')
})
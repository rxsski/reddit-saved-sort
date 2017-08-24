import Categories from './Components/Categories/index.vue';
import Links from './Components/Links/index.vue';

export default {
  name: 'App',
  data() {
    return {}
  },
  components: {
    'categories': Categories,
    'links': Links
  } 
}
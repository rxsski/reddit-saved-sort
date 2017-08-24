import bus from '../../../bus';

export default {
  name: 'Categories',
  methods: {
    updateCatList() {
      bus.$emit('update-cat-list');
    }
  }
}
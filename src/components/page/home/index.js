import modernizr from 'modernizr';
require('./view.html');
require('./style.scss');

export default {
  name: 'pageHome',
  template: '#components-page-home',
  mounted() {
    console.log('-- (Example of using modernizr) Geolocation support is: ', modernizr.geolocation);
  }
};
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { rtdbPlugin } from 'vuefire'
import App from './App'
import router from './router'

Vue.use(rtdbPlugin)

// Require the main Sass manifest file
require('./assets/sass/style.scss');

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

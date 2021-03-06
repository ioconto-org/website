import Vue from 'vue';
import VueMeta from 'vue-meta';
import App from './App.vue';
import VueGtag from "vue-gtag";
import BootstrapVue from 'bootstrap-vue';
import BootstrapVueIcons from 'bootstrap-vue';

import i18n from './i18n';
import router from './router';

/* Css Styles */
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

/* Fix for a problem with the marker icons */
import { Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Vue.use(VueMeta);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueGtag, {
  config: { id: "UA-164557154-1" }
});

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  render: h => h(App),
}).$mount('#app')

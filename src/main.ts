import Vue from 'vue';
import router from './router';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import store from './store/store';
import Auth, { IUserFlows } from './utils/Auth';
import { Configuration } from 'msal';
import VueRouter from 'vue-router';
import './registerServiceWorker';

Vue.config.productionTip = false;

const config: Configuration = {
  auth: {
    clientId: 'f8b8ed45-8ac1-442d-961d-c6efb6f2413b',
    authority:
      'https://incrementally.b2clogin.com/incrementally.onmicrosoft.com/B2C_1_signin',
    validateAuthority: false
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true
  }
};
const userFlows: IUserFlows = {
  signin:
    'https://incrementally.b2clogin.com/incrementally.onmicrosoft.com/B2C_1_signin',
  signup:
    'https://incrementally.b2clogin.com/incrementally.onmicrosoft.com/B2C_1_signup'
};
declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth;
  }
}
Vue.prototype.$auth = new Auth(config, userFlows);

Vue.use(VueRouter);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');

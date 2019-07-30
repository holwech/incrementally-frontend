import Vue from 'vue';
import router from './router';
import './plugins/vuetify';
import App from './App.vue';
import store from './store';
import Auth, { IUserFlows } from './utils/Auth';
import { Configuration } from 'msal';
import VueRouter from 'vue-router';

Vue.config.productionTip = false;

const config: Configuration = {
  auth: {
    clientId: 'f8b8ed45-8ac1-442d-961d-c6efb6f2413b',
    authority: 'https://login.microsoftonline.com/tfp/incrementally.onmicrosoft.com/signin/v2.0/',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
};
const userFlows: IUserFlows = {
  signin: 'https://login.microsoftonline.com/tfp/incrementally.onmicrosoft.com/B2C_1_signin/v2.0/',
  signup: 'https://login.microsoftonline.com/tfp/incrementally.onmicrosoft.com/B2C_1_signup/v2.0/',
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
  render: (h) => h(App),
}).$mount('#app');

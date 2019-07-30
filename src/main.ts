import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import store from './store';
import Auth, { IUserFlows } from './utils/Auth';
import { Configuration, AuthenticationParameters } from 'msal';

Vue.config.productionTip = false;

const config: Configuration = {
  auth: {
    clientId: 'f8b8ed45-8ac1-442d-961d-c6efb6f2413b',
    authority: 'https://login.microsoftonline.com/tfp/incrementally.onmicrosoft.com/signin',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
};

const userFlows: IUserFlows = {
  signin: 'https://login.microsoftonline.com/tfp/incrementally.onmicrosoft.com/B2C_1_signin',
  signup: 'https://login.microsoftonline.com/tfp/incrementally.onmicrosoft.com/B2C_1_signup',
};

declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth;
  }
}

Vue.prototype.$auth = new Auth(config, userFlows);

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');

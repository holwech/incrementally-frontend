import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import store from './store';
import Auth from './utils/Auth';
import { Configuration, AuthenticationParameters } from 'msal';

Vue.config.productionTip = false;

const config: Configuration = {
  auth: {
    clientId: 'f4873da0-2d4c-4c09-bc12-e16b20d533f7',
    authority: 'https://login.microsoftonline.com/f5645dc2-3b1c-4ccf-9a0e-44b34d77eb58',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
};

const requestObject: AuthenticationParameters = {
  scopes: ['user.read'],
};

Vue.prototype.$auth = new Auth(config, requestObject);

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');

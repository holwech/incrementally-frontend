<template>
  <!-- <v-btn class="success" @click="login">{{ loginText }}</v-btn> -->
  <div class="text-xs-center">
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn color="white" class="ml-1" tile outlined v-on="on">
          <span> {{ user.loggedIn ? 'Profile' : 'Login' }} </span>
        </v-btn>
      </template>
      <v-list flat tile>
        <v-list-item v-if="user.loggedIn">
          <v-list-item-title>{{ user.username }}</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="user.loggedIn" @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="!user.loggedIn" @click="signup">
          <v-list-item-title>Sign up</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="!user.loggedIn" @click="login">
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { AuthenticationParameters } from 'msal';
import { userStore } from '../store/UserStore';

@Component
export default class LoginButton extends Vue {
  private user = userStore;

  private async login() {
    await this.user.login(this.$auth);
  }

  private async logout() {
    await this.user.logout(this.$auth);
  }

  private async signup() {
    await this.user.signup(this.$auth);
  }
}
</script>

<style scoped></style>

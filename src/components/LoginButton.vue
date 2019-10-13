<template>
  <!-- <v-btn class="success" @click="login">{{ loginText }}</v-btn> -->
  <div class="text-xs-center">
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn color="white" class="ml-1" tile outlined v-on="on">
          <span> {{ loggedIn ? 'Profile' : 'Login' }} </span>
        </v-btn>
      </template>
      <v-list flat tile>
        <v-list-item v-if="loggedIn">
          <v-list-item-title>{{ username }}</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="loggedIn" @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="!loggedIn" @click="signup">
          <v-list-item-title>Sign up</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="!loggedIn" @click="login">
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { AuthenticationParameters } from 'msal';

@Component
export default class LoginButton extends Vue {
  private username = 'Unknown';
  private loggedIn = false;
  private requestObject: AuthenticationParameters = {
    scopes: [
      'https://incrementally.onmicrosoft.com/api/Recordings.Write',
      'https://incrementally.onmicrosoft.com/api/Recordings.Read'
    ]
  };

  private mounted(): void {
    if (this.$auth.account) {
      // console.log(this.$auth.getAccessTokenAsync(this.requestObject).then((el) => el.accessToken));
      this.setLoginStatus();
    }
  }

  private login(): void {
    if (!this.$auth.account) {
      this.$auth.login().then(() => this.setLoginStatus());
    } else {
      this.setLoginStatus();
    }
  }

  private signup(): void {
    this.$auth.signup();
  }

  private setLoginStatus(login: boolean = true): void {
    if (login) {
      this.username = this.$auth.account!.idTokenClaims.given_name;
      this.loggedIn = true;
    } else {
      this.username = 'Unknown';
      this.loggedIn = false;
    }
  }

  private logout(): void {
    this.$auth.logout();
    this.setLoginStatus(false);
  }
}
</script>

<style scoped></style>

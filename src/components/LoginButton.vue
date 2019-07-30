<template>
  <!-- <v-btn class="success" @click="login">{{ loginText }}</v-btn> -->
  <div class="text-xs-center">
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn
          color="yellow"
          light
          v-on="on"
        >
          <span> Profile </span>
        </v-btn>
      </template>
      <v-list>
        <v-list-tile v-if="loggedIn">
          <v-list-tile-title>{{ username }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="loggedIn" @click="logout">
          <v-list-tile-title >Logout</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="!loggedIn" @click="signup">
          <v-list-tile-title >Sign up</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="!loggedIn" @click="login">
          <v-list-tile-title >Login</v-list-tile-title>
        </v-list-tile>
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
    scopes: ['https://incrementally.onmicrosoft.com/api/Recordings.Write'],
  };


  private mounted(): void {
    if (this.$auth.account) {
      this.setLoginStatus();
      console.log(this.$auth.getAccessToken(this.requestObject));
    }
  }

  private login(): void {
    if (!this.$auth.account) {
      this.$auth.login()
        .then(() => this.setLoginStatus());
    } else {
      this.setLoginStatus();
    }
  }

  private signup(): void {
    this.$auth.signup();
  }

  private setLoginStatus(login: boolean = true): void {
    if (login) {
      this.username = this.$auth.account.idTokenClaims.given_name;
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

<style scoped>
</style>
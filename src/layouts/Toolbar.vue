<template>
  <v-app-bar color="grey darken-3" dark fixed app>
    <v-toolbar-title  class="no-link-style">
      <router-link style="color:white" :to="{ name: 'MainMenu' }">
        Incrementally
      </router-link>
      <sup>
        <span style="color:yellow" @click="betaText">beta</span>
      </sup>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <slot></slot>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Toolbar extends Vue {
  private betaText(): void {
    this.$auth
      .getAccessTokenAsync({
        scopes: [
          'https://incrementally.onmicrosoft.com/api/Recordings.Write',
          'https://incrementally.onmicrosoft.com/api/Recordings.Read'
        ]
      })
      .then(token => console.log(token.accessToken));
    console.log(this.$auth.account);
  }
}
</script>

<template>
  <v-app-bar color="grey darken-3" dark fixed app :collapse="collapseToolbar">
    <v-layout v-if="!collapseToolbar">
      <v-toolbar-title class="no-link-style">
        <router-link style="color:white" :to="{ name: 'MainMenu' }">
          Incrementally
        </router-link>
        <sup>
          <span style="color:yellow" @click="betaText">beta</span>
        </sup>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <slot></slot>
      </v-toolbar-items>
    </v-layout>
    <v-icon
      v-if="showCollapseButton"
      @click="collapseToolbar = !collapseToolbar"
      >{{
        collapseToolbar ? 'keyboard_arrow_right' : 'keyboard_arrow_left'
      }}</v-icon
    >
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Toolbar extends Vue {
  @Prop({ type: Boolean, default: false })
  private readonly showCollapseButton?: Boolean;

  private collapseToolbar = false;
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

<template>
  <v-toolbar color="grey darken-3" dark fixed app>
    <v-toolbar-title class='no-link-style'>
      <router-link :to="{ name: 'MainMenu' }">
        Incrementally
      </router-link>
      <sup>
        <span style="color:yellow">beta</span>
      </sup>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <slot></slot>
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Toolbar extends Vue { }
</script>
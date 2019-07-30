<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Editor from '@/layouts/Editor';
import MainMenu from '@/layouts/MainMenu';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  components: {
    Editor,
    MainMenu,
  },
})
export default class App extends Vue {
}
</script>

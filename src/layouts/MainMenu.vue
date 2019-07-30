<template>
  <div>
    <v-app id="inspire">
      <Toolbar>
        <router-link :to="{ name: 'Editor' }">
          <v-btn color="white" light depressed>Open editor</v-btn>
        </router-link>
        <LoginButton />
      </Toolbar>
      <v-container fluid grid-list-xl>
        <v-layout row wrap>
          <v-flex d-flex xs12 order-xs5>
            <v-flex d-flex>
              <v-card color="grey darken-3" dark>
                <svg
                    class="svg-predisplay"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    id="svg"
                    enable-background="new 0 0 1200 800"
                    xml:space="preserve"
                >
                </svg>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">This is some stored SVG-video</h3>
                  </div>
                </v-card-title>
                <v-card-text>This is some description</v-card-text>
                <v-card-actions>
                  <v-btn flat color="blue">Open</v-btn>
                  <v-btn flat color="blue">Delete</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
            <v-flex d-flex>
              <v-card color="grey darken-3" dark>
                <svg
                    class="svg-predisplay"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    id="svg"
                    enable-background="new 0 0 1200 800"
                    xml:space="preserve"
                >
                </svg>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">This is some stored SVG-video</h3>
                  </div>
                </v-card-title>
                <v-card-text>This is some description</v-card-text>
                <v-card-actions>
                  <v-btn flat color="blue">Open</v-btn>
                  <v-btn flat color="blue">Delete</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
            <v-flex d-flex>
              <v-card color="grey darken-3" dark>
                <svg
                    class="svg-predisplay"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    id="svg"
                    enable-background="new 0 0 1200 800"
                    xml:space="preserve"
                >
                </svg>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">This is some stored SVG-video</h3>
                  </div>
                </v-card-title>
                <v-card-text>This is some description</v-card-text>
                <v-card-actions>
                  <v-btn flat color="blue">Open</v-btn>
                  <v-btn flat color="blue">Delete</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-container>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import LoginButton from '@/components/LoginButton.vue';
import Toolbar from '@/layouts/Toolbar.vue';

@Component({
  components: {
    LoginButton,
    Toolbar,
  },
})
export default class MainMenu extends Vue {
}
</script>

<style>
.no-link-style a {
  color: white;
  text-decoration: none; /* no underline */
}

.svg-predisplay {
  width: 100%;
}

</style>
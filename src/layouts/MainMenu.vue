<template>
  <div>
    <v-app id="inspire">
      <Toolbar>
        <router-link :to="{ name: 'Editor' }">
          <v-btn outlined tile>Open editor</v-btn>
        </router-link>
        <LoginButton />
      </Toolbar>
      <v-container fluid grid-list-xl>
        <v-row v-if="entries.length === 0">
          <v-col cols="12">
            <v-row
              justify="center"
              class="grey lighten-5"
              style="height: 300px;"
            >
              <v-card outlined tile class="worker">
                👨‍🔧
                <br />
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
        <v-layout v-else row wrap justify-center grid-list-xl>
          <v-flex v-for="entry in entries" :key="entry.id" md3>
            <v-card color="grey darken-3" dark>
              <!-- <svg
                id="svg"
                class="svg-predisplay"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                version="1.1"
                enable-background="new 0 0 1200 800"
                xml:space="preserve"
              ></svg> -->
              <p class="worker">👨‍🔧<br /></p>
              <p class="work-in-progress">Work in progress</p>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">{{ entry.title }}</h3>
                </div>
              </v-card-title>
              <v-card-text>{{ entry.description }}</v-card-text>
              <v-card-actions>
                <v-btn text color="blue">Open</v-btn>
                <v-btn text color="blue">Delete</v-btn>
              </v-card-actions>
            </v-card>
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

interface RecordingMetadata {
  createdBy: string;
  description: string;
  givenName: string;
  id: string;
  surname: string;
  title: string;
}

@Component({
  components: {
    LoginButton,
    Toolbar
  }
})

export default class MainMenu extends Vue {
  private entries = Array<RecordingMetadata>();

  private mounted(): void {
    console.log('Saving recording...');
    this.$auth
      .query('https://localhost:5001/api/metadata', {
        scopes: [
          'https://incrementally.onmicrosoft.com/api/Recordings.Write',
          'https://incrementally.onmicrosoft.com/api/Recordings.Read'
        ]
      })
      .then(res => res.json())
      .then(json => (this.entries = json));
  }
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

.worker {
  font-size: 100px;
  text-align: center;
  width: 400px;
}

.work-in-progress {
  text-align: center;
}
</style>

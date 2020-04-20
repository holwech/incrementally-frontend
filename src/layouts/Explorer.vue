<template>
  <div
    id="main-wrapper"
  >
    <Toolbar>
      <router-link :to="{ name: 'Editor' }">
        <b-btn variant="outline-light"
        >
          Open editor
        </b-btn>
      </router-link>
      <LoginButton />
    </Toolbar>
    <b-container id="main-container">
      <b-row align-h="center" style="margin-bottom: 50px;">
        <b-col cols="6">
          <b-form-input v-model="searchInput" size="lg" placeholder="Search for anything"></b-form-input>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col cols="8" style="text-align:center;">
          <b-spinner label="Loading..." size="lg" v-if="searching" style="width: 3rem; height: 3rem;"></b-spinner>
          <b-card
            v-else
            v-for="entry in entries" :key="entry.id"
            :title="entry.title"
          >
            <b-card-text>
              {{ entry.title }}
            </b-card-text>

            <b-button href="#" variant="primary">Open</b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import LoginButton from '@/components/LoginButton.vue';
import Toolbar from '@/layouts/Toolbar.vue';
import Board from '@/utils/Board';

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
export default class Explore extends Vue {
  private entries = Array<RecordingMetadata>();
  private searching = false;
  private searchInput = '';

  private mounted(): void {
    this.searching = true;
    this.$auth
      .query(
        process.env.VUE_APP_URL + '/api/metadata',
        {
          scopes: [
            process.env.VUE_APP_SCOPE_WRITE,
            process.env.VUE_APP_SCOPE_READ
          ]
        },
        'GET',
        null,
        false
      )
      .then(res => res.json())
      .then(json => (this.entries = json))
      .then(() => this.searching = false);
  }
}
</script>
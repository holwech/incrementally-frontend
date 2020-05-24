<template>
  <div id="main-wrapper">
    <Toolbar>
      <router-link :to="{ name: 'Editor' }">
        <b-btn variant="outline-light">
          Open editor
        </b-btn>
      </router-link>
      <LoginButton />
    </Toolbar>
    <b-container id="main-container">
      <b-row
        align-h="center"
        style="margin-bottom: 50px;"
      >
        <b-col cols="6">
          <b-form-input
            v-model="searchInput"
            size="lg"
            placeholder="Search does not work yet"
          />
        </b-col>
      </b-row>
      <b-row
        align-h="center"
        class="result-explore-main"
      >
        <b-col cols="8">
          <b-spinner
            v-if="searching"
            label="Loading..."
            size="lg"
            style="width: 3rem; height: 3rem;"
          />
          <b-card
            v-for="entry in entries"
            v-else
            :key="entry.id"
            :title="entry.title"
            class="result-explore"
          >
            <b-card-text>
              {{ entry.description }}
              {{ entry.createdBy }}
            </b-card-text>

            <router-link :to="{ name: 'EditorWithLoad', params: { id: entry.id } }">
              <b-btn variant="outline-dark">
                Open
              </b-btn>
            </router-link>
            <b-button
              v-if="canDelete(entry.createdBy)"
              v-b-modal.delete-entry
              variant="outline-dark"
              style="margin-left: 5px"
              @click="openDeleteModal(entry.id)"
            >
              Delete
            </b-button>
          </b-card>
        </b-col>
      </b-row>
      <b-modal
        id="delete-entry"
        v-model="showModal"
        title="Delete item"
        hide-footer
      >
        <p>Are you sure?</p>
        <b-button
          variant="danger"
          class="float-right"
          :disabled="deleting"
          style="margin-left:5px;"
          @click="deleteEntry"
        >
          Delete
        </b-button>
        <b-button
          class="float-right"
          :disabled="deleting"
          @click="showModal = false"
        >
          Cancel
        </b-button>
        <b-spinner
          v-if="deleting"
          class="float-right"
          variant="primary"
          style="margin: 5px;"
        />
      </b-modal>
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
export default class Explorer extends Vue {
  private entries = Array<RecordingMetadata>();
  private searching = false;
  private searchInput = '';
  private deleting = false;
  private selectedDelete?: string;
  private showModal = false;

  private canDelete(id: string) {
    return this.$auth.idToken && this.$auth.idToken.uniqueId === id;
  }

  private openDeleteModal(entryId: string): void {
    this.selectedDelete = entryId;
  }

  private async deleteEntry() {
    this.deleting = true;
    const res = await this.$auth.query(
      process.env.VUE_APP_URL + '/api/recording/' + this.selectedDelete,
      {
        scopes: [
          process.env.VUE_APP_SCOPE_WRITE,
          process.env.VUE_APP_SCOPE_READ
        ]
      },
      'DELETE',
      null,
      true
    );
    console.log(res);
    this.deleting = false;
    this.showModal = false;
    this.getEntries();
  }

  private getEntries(): void {
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
      .then(() => (this.searching = false));
  }

  private mounted(): void {
    this.searching = true;
    this.getEntries();
  }
}
</script>


<style lang="scss">
.result-explore {
  margin-bottom: 20px;
}

.result-explore-main {
  text-align: center;
  .result-explore {
    text-align: left;
  }
}
</style>
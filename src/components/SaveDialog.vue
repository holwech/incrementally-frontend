<template>
  <div>
    <v-btn
      color="white"
      class="ml-1"
      tile
      outlined
      @click="dialog = true"
    >
      <span> Save </span>
    </v-btn>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline"
          primary-title
        >
          Save
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-col md12>
                <v-row>
                  <v-text-field
                    v-model="form.title.value"
                    label="Title"
                    :rules="form.title.rules"
                  />
                </v-row>
                <v-row>
                  <v-textarea
                    v-model="form.description.value"
                    label="Description"
                    :rules="form.description.rules"
                  />
                </v-row>
              </v-col>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-progress-circular
            v-if="RecordStore.loading"
            indeterminate
            color="primary"
          ></v-progress-circular>
          <v-btn
            v-else
            color="primary"
            text
            :disabled="disableSave"
            @click="save"
          >
            Save
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="close"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { SaveDialogForm } from '@/models/SaveDialogForm';
import { RecordStore } from '@/store/RecordStore';
import { IAction } from 'drawify/lib/Interfaces/ActionInterfaces';

interface SaveDialogFormElement {
  value: string;
  rules: Array<(v: string) => any>;
}

interface SaveDialogFormTemplate {
  title: SaveDialogFormElement;
  description: SaveDialogFormElement;
}

@Component
export default class SaveDialog extends Vue {
  @Prop(Boolean) private readonly dialog = false;

  private RecordStore = RecordStore;
  private disableSave = true;
  private rules = {
    required: (v: string) => !!v || 'Required.',
    min: (v: string) => v.length >= 4 || 'Min 4 characters',
    emailMatch: () => 'The email and password you entered do not match'
  };
  private form: SaveDialogFormTemplate = {
    title: {
      value: '',
      rules: [this.rules.required, this.rules.min]
    },
    description: {
      value: '',
      rules: [this.rules.required, this.rules.min]
    }
  };

  @Watch('form', { deep: true })
  private verify(): void {
    for (const [key, formValue] of Object.entries(this.form)) {
      for (const rule of formValue.rules) {
        if (!rule(formValue.value)) {
          this.disableSave = true;
          return;
        }
      }
    }
    this.disableSave = false;
  }

  @Watch('RecordStore.loading')
  private closeOnLoadingDone() {
    if (!this.RecordStore.loading) {
      this.close();
    }
  }

  private close(): void {
    this.$emit('close');
  }

  private save(): void {
    RecordStore.Save({
      auth: this.$auth,
      formData: {
        title: this.form.title.value,
        description: this.form.description.value
      }
    });
  }
}
</script>

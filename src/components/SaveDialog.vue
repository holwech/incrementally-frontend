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
          <v-spacer />
          <v-btn
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
            @click="dialog = false"
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

export interface SaveDialogFormElement {
  value: string;
  rules: Array<(v: string) => any>;
}

export interface SaveDialogForm {
  title: SaveDialogFormElement;
  description: SaveDialogFormElement;
}

@Component
export default class SaveDialog extends Vue {
  private disableSave = true;
  private dialog = false;
  private rules = {
    required: (v: string) => !!v || 'Required.',
    min: (v: string) => v.length >= 4 || 'Min 4 characters',
    emailMatch: () => 'The email and password you entered do not match'
  };
  private form: SaveDialogForm = {
    title: {
      value: '',
      rules: [this.rules.required, this.rules.min]
    },
    description: {
      value: '',
      rules: [this.rules.required, this.rules.min]
    }
  };

  @Watch('dialog')
  private emitDialogOpen() {
    this.$emit('onDialogOpen', this.dialog);
  }

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

  private save(): void {
    this.dialog = false;
    this.$emit('save', this.form);
  }
}
</script>

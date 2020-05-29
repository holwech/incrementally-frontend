<template>
  <b-modal
    :id="modalId"
    v-model="showModal"
    title="Save"
    hide-footer
  >
    <b-form-group
      label="Title"
      label-for="save-title"
    >
      <b-form-input
        id="save-title"
        v-model="form.title.value"
      />
    </b-form-group>

    <b-form-group
      label="Description"
      label-for="save-description"
    >
      <b-form-textarea
        id="save-description"
        v-model="form.description.value"
        placeholder="Enter a description..."
        rows="3"
        max-rows="6"
      />
    </b-form-group>
    <b-button
      :variant="disableSave ? 'dark' : 'primary'"
      class="float-right"
      :disabled="disableSave"
      style="margin-left:5px;"
      @click="save"
    >
      Save
    </b-button>
    <b-button
      class="float-right"
      @click="showModal = false"
    >
      Cancel
    </b-button>
    <b-spinner
      v-if="RecordStore.loading"
      class="float-right"
      variant="primary"
      style="margin: 5px;"
    />
  </b-modal>
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
  @Prop(String) readonly modalId?: string;
  private showModal = false;

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
      this.showModal = false;
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

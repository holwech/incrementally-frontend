<template>
  <div id="main-wrapper">
    <Toolbar>
      <b-spinner 
        label="Loading..."
        variant='light'
        v-if="RecordStore.loadingRecording && RecordStore.loadingMetadata"
        style="margin:4px;"
      ></b-spinner>
      <b-button
        v-if="board.isPlaying"
        variant="dark"
        class="icon-button editor-button"
        style="color:red;"
        @click="board.controller.pause()"
      >
        <span class="material-icons">fiber_manual_record</span>
      </b-button>
      <b-button
        v-else
        variant="light"
        class="icon-button editor-button"
        @click="board.controller.start()"
      >
        <span class="material-icons">play_arrow</span>
      </b-button>
      <b-button
        variant="light"
        class="icon-button editor-button"
        @click="board.controller.restart()"
      >
        <span class="material-icons">replay</span>
      </b-button>
      <b-button
        variant="light"
        class="icon-button editor-button"
      >
        {{
          board.timer.timeMonitor.minutes +
            ':' +
            board.timer.timeMonitor.seconds +
            ' / ' +
            board.timer.timeMonitor.lengthMinutes +
            ':' +
            board.timer.timeMonitor.lengthSeconds
        }}
      </b-button>
      <b-button variant="light" class="editor-button" v-b-modal.modal-settings>Settings</b-button>
      <b-modal id="modal-settings" title="Settings" ok-only>
        <b-form-group
          label="Smoothness"
          description="Set how smooth the free hand drawing should be"
          label-for="input-smoothness"
        >
          <b-form-select id="input-smoothness" v-model="smoothnessSelected" :options="smoothnessOptions"></b-form-select>
        </b-form-group>
        <b-form-group
          label="Color"
          description="Set the color"
          label-for="input-color"
        >
          <b-form-select id="input-color" v-model="colorSelected" :options="colorOptions"></b-form-select>
        </b-form-group>
        <b-form-group
          label="Strok width"
          description="Set the stroke width"
          label-for="input-stroke-width"
        >
          <b-form-select id="input-stroke-width" v-model="strokeWidthSelected" :options="strokeWidthOptions"></b-form-select>
        </b-form-group>
      </b-modal>
      <LoginButton />
    </Toolbar>
    <div id="board" />
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SettingsDialog from '@/components/SettingsDialog.vue';
import HelpDialog from '@/components/HelpDialog.vue';
import SaveDialog from '@/components/SaveDialog.vue';
import Toolbar from '@/layouts/Toolbar.vue';
import LoginButton from '@/components/LoginButton.vue';
import Service from 'drawify/lib/Controllers/Service';
import AppState from 'drawify/lib/State/AppState';
import ServiceBuilder from 'drawify';
import {
  StrokeAttributes,
  IAction
} from 'drawify/lib/Interfaces/ActionInterfaces';
import { AppStates } from 'drawify/lib/Interfaces/AppInterfaces';
import { RecordController } from 'drawify/lib/Controllers/RecordController';
import Timer from 'drawify/lib/Timer/Timer';
import { PlayBaseController } from 'drawify/lib/Controllers/PlayBaseController';
import RecordingMetadata from '../models/RecordingMetadata';
import IRecordingEntry from '@/models/RecordingEntry';
import { RecordStore } from '@/store/RecordStore';
import Board from '@/utils/Board';

@Component({
  components: {
    SettingsDialog,
    HelpDialog,
    Toolbar,
    LoginButton,
    SaveDialog
  }
})
export default class Editor extends Vue {
  @Prop(String) readonly id?: string;
  private RecordStore = RecordStore;
  private board = new Board();
  private smoothnessOptions = [
    { value: 1, text: 'None' },
    { value: 2, text: 'Low' },
    { value: 4, text: 'Normal' },
    { value: 6, text: 'High' },
    { value: 8, text: 'Very high' },
  ];
  private smoothnessSelected = this.smoothnessOptions[2].value;
  private colorOptions = [
    { value: 'black', text: 'Black' },
    { value: 'blue', text: 'Blue' },
    { value: 'red', text: 'Red' },
    { value: 'green', text: 'Green' }
  ];
  private colorSelected = this.colorOptions[0].value;
  private strokeWidthOptions = [
    { value: 1, text: '1px' },
    { value: 2, text: '2px' },
    { value: 4, text: '4px' },
    { value: 6, text: '6px' },
    { value: 8, text: '8px' }
  ];
  private strokeWidthSelected = this.strokeWidthOptions[1].value;

  @Watch('smoothnessSelected')
  private setSmoothness(newVal: any, oldVal: any) {
    console.log(newVal);
    this.board.setStrokeAttribute(StrokeAttributes.BUFFER_SIZE, newVal);
  }

  @Watch('colorSelected')
  private setColor(newVal: any, oldVal: any) {
    this.board.setStrokeAttribute(StrokeAttributes.COLOR, newVal);
  }

  @Watch('strokeWidthSelected')
  private setStrokeWidth(newVal: any, oldVal: any) {
    this.board.setStrokeAttribute(StrokeAttributes.WIDTH, newVal);
  }

  private async mounted(): Promise<void> {
    this.board.create('board');
    if (this.id) {
      await Promise.all([
        RecordStore.LoadMetadata({ id: this.id, auth: this.$auth }),
        RecordStore.LoadRecording({ id: this.id, auth: this.$auth })
      ]);
      console.log(RecordStore.loadingMetadata);
      console.log(RecordStore.recording);
      this.board.setRecording(RecordStore.recording);
    }
  }

  // @Prop(String) readonly id?: string;

  // private RecordStore = RecordStore;
  // private state = new AppState();
  // private drawer = false;
  // private container?: ServiceBuilder;
  // private controller?: Service = undefined;
  // private loading = false;
  // private entries: any = {};
  // private timer = new Timer();
  // private dialog = false;
  // private recordColor = 'grey';
  // private recording = false;
  // private playing = false;
  // private saveDialog = false;
  // private recordingData: IAction[] = RecordStore.recording;
  // private msg: string = 'Drawing board';
  // private smoothness = { text: '4 - Sharp curves', value: 4 };
  // private slider = 0;
  // private color = { text: 'Black', value: 'black' };
  // private width = { text: '1px', value: 1 };
  // private fillColor = { text: 'Black', value: 'black' };
  // private panMode: string = 'off';
  // private selectSmoothnessItems = [
  //   { text: '1 - No smoothing', value: 1 },
  //   { text: '4 - Sharp curves', value: 4 },
  //   { text: '20 - Hyper smooth curves', value: 20 }
  // ];
  // private selectColorItems = [
  //   { text: 'Black', value: 'black' },
  //   { text: 'Blue', value: 'blue' },
  //   { text: 'Red', value: 'red' },
  //   { text: 'Green', value: 'green' }
  // ];
  // private selectWidthItems = [
  //   { text: '1px', value: 1 },
  //   { text: '2px', value: 2 },
  //   { text: '4px', value: 4 },
  //   { text: '8px', value: 8 }
  // ];
  // private fill = false;
  // private helpText = [
  //   'Click play/space to start recording',
  //   'Click reverse and then play to view recording',
  //   'Hold CTRL and click left mouse button to pan',
  //   'Scroll to zoom',
  //   'Click on drawing to remove it'
  // ];

  // private saveDialogOpen(dialog: boolean) {
  //   this.saveDialog = dialog;
  // }

  // private playToggle(e: KeyboardEvent): void {
  //   if (this.saveDialog) {
  //     return;
  //   }
  //   if (e.keyCode === 32 || e.key === ' ') {
  //     if (this.isPlaying) {
  //       this.controller!.pause();
  //     } else {
  //       this.controller!.start();
  //     }
  //   }
  // }

  // private panOn(e: KeyboardEvent): void {
  //   if (e.keyCode === 17) {
  //     this.panMode = 'on';
  //     this.controller!.stateToggle(true);
  //   }
  // }

  // private panOff(e: KeyboardEvent): void {
  //   if (e.keyCode === 17) {
  //     this.panMode = 'off';
  //     this.controller!.stateToggle(false);
  //   }
  // }

  // private async mounted() {
  //   this.container = new ServiceBuilder();
  //   this.controller = this.container.build(
  //     document.getElementById('svg')!,
  //     this.state,
  //     this.timer
  //   );
  //   if (this.id) {
  //     let player = this.container
  //       .getContainer()
  //       .resolve<PlayBaseController>(PlayBaseController);
  //     await Promise.all([
  //       RecordStore.LoadMetadata({ id: this.id, auth: this.$auth }),
  //       RecordStore.LoadRecording({ id: this.id, auth: this.$auth })
  //     ]);
  //     console.log(RecordStore.recording);
  //     player.setEventLog(RecordStore.recording);
  //   } else {
  //     this.controller.init([
  //       { targetAttr: StrokeAttributes.COLOR, value: this.color.value },
  //       { targetAttr: StrokeAttributes.WIDTH, value: this.width.value },
  //       {
  //         targetAttr: StrokeAttributes.BUFFER_SIZE,
  //         value: this.smoothness.value
  //       },
  //       { targetAttr: StrokeAttributes.FILL, value: undefined }
  //     ]);
  //   }
  //   window.addEventListener('keydown', this.panOn);
  //   window.addEventListener('keyup', this.panOff);
  //   window.addEventListener('keydown', this.playToggle);
  // }

  // private clear(): void {
  //   this.controller!.clear();
  // }

  // private setStrokeProperties(attr: StrokeAttributes): void {
  //   let value;
  //   switch (attr) {
  //     case StrokeAttributes.COLOR:
  //       value = this.color.value;
  //       break;
  //     case StrokeAttributes.WIDTH:
  //       value = this.width.value;
  //       break;
  //     case StrokeAttributes.BUFFER_SIZE:
  //       value = this.smoothness.value;
  //       break;
  //     case StrokeAttributes.FILL:
  //       value = this.fill ? this.fillColor.value : undefined;
  //       break;
  //     default:
  //       break;
  //   }
  //   this.controller!.setStrokeProperties({
  //     targetAttr: attr,
  //     value
  //   });
  // }

  // get isPlaying(): boolean {
  //   return this.state.state === AppStates.START;
  // }

  // private save(): void {
  //   RecordStore.SetRecording(this.controller!.export());
  //   this.dialog = true;
  // }

  // private printAccessToken(): void {
  //   this.$auth
  //     .getAccessTokenAsync({
  //       scopes: [
  //         process.env.VUE_APP_SCOPE_WRITE,
  //         process.env.VUE_APP_SCOPE_READ
  //       ]
  //     })
  //     .then(el => console.log(el.accessToken));
  // }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#svg {
  border: 0px solid black;
  touch-action: none;
}
</style>

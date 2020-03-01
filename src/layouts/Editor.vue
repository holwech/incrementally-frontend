<template>
  <div>
    <v-app id="inspire">
      <!-- <v-navigation-drawer
        fixed
        v-model="drawer"
        app
        >
        <v-list dense>
          <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Contact</v-list-tile-title>
          </v-list-tile-content>
          </v-list-tile>
        </v-list>
        </v-navigation-drawer> -->
      <Toolbar :show-collapse-button="true">
        <v-toolbar-title>
          {{ RecordStore.recordingMetadata.title }}
          <v-progress-circular
            v-if="!RecordStore.loadingRecording || !RecordStore.loadingMetadata"
            indeterminate
            color="white"
          ></v-progress-circular>
        </v-toolbar-title>
        <v-btn text @click="printAccessToken"
          >{{
            timer.timeMonitor.minutes +
              ':' +
              timer.timeMonitor.seconds +
              ' / ' +
              timer.timeMonitor.lengthMinutes +
              ':' +
              timer.timeMonitor.lengthSeconds
          }}
        </v-btn>
        <v-btn depressed tile text @click="controller.restart()">
          <v-icon>replay</v-icon>
        </v-btn>
        <!-- <v-btn color="white" @click="controller.reverse()"><v-icon color="black">fast_rewind</v-icon></v-btn> -->
        <v-btn v-if="isPlaying" tile depressed text @click="controller.pause()">
          <v-icon color="red">fiber_manual_record</v-icon>
        </v-btn>
        <v-btn v-else color="white" tile depressed @click="controller.start()">
          <v-icon color="black">play_arrow</v-icon>
        </v-btn>
        <v-btn color="white" class="ml-1" tile outlined @click="save">
          <span> Save </span>
        </v-btn>
        <SaveDialog :dialog="dialog" @close="dialog = false"></SaveDialog>
        <!-- <v-toolbar-items class="hidden-sm-and-down">
          <v-select
            item-text="text"
            item-value="value"
            :items="selectSmoothnessItems"
            @input="setStrokeProperties"
            v-model="smoothness"
            label="Smoothness"
            return-object
            color='black'
          ></v-select>
        </v-toolbar-items> -->
        <SettingsDialog>
          <v-select
            v-model="color"
            item-text="text"
            item-value="value"
            :items="selectColorItems"
            label="Color"
            return-object
            color="black"
            @input="setStrokeProperties('stroke')"
          ></v-select>
          <v-select
            v-model="width"
            item-text="text"
            item-value="value"
            :items="selectWidthItems"
            label="Width"
            return-object
            color="black"
            @input="setStrokeProperties('stroke-width')"
          ></v-select>
          <v-select
            v-model="fillColor"
            item-text="text"
            item-value="value"
            :items="selectColorItems"
            label="Fill color"
            return-object
            color="black"
            @input="setStrokeProperties('fill')"
          ></v-select>
          <v-checkbox
            v-model="fill"
            label="Fill"
            @change="setStrokeProperties('fill')"
          ></v-checkbox>
        </SettingsDialog>
        <HelpDialog>
          <v-flex>
            <v-list>
              <v-list-tile v-for="text in helpText" :key="text">
                <v-list-tile-action>
                  <v-icon>star</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-text="text"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>
        </HelpDialog>
        <LoginButton />
      </Toolbar>
      <v-content ma-0 pa-0 style="padding: 0px">
        <v-container fluid fill-height ma-0 pa-0>
          <v-layout justify-center align-center row wrap>
            <v-flex text-xs-center>
              <svg
                id="svg"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                version="1.1"
              ></svg>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
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
  private state = new AppState();
  private drawer = false;
  private container?: ServiceBuilder;
  private controller?: Service = undefined;
  private loading = false;
  private entries: any = {};
  private timer = new Timer();
  private dialog = false;
  private recordColor = 'grey';
  private recording = false;
  private playing = false;
  private saveDialog = false;
  private recordingData: IAction[] = RecordStore.recording;
  private msg: string = 'Drawing board';
  private smoothness = { text: '4 - Sharp curves', value: 4 };
  private slider = 0;
  private color = { text: 'Black', value: 'black' };
  private width = { text: '1px', value: 1 };
  private fillColor = { text: 'Black', value: 'black' };
  private panMode: string = 'off';
  private selectSmoothnessItems = [
    { text: '1 - No smoothing', value: 1 },
    { text: '4 - Sharp curves', value: 4 },
    { text: '20 - Hyper smooth curves', value: 20 }
  ];
  private selectColorItems = [
    { text: 'Black', value: 'black' },
    { text: 'Blue', value: 'blue' },
    { text: 'Red', value: 'red' },
    { text: 'Green', value: 'green' }
  ];
  private selectWidthItems = [
    { text: '1px', value: 1 },
    { text: '2px', value: 2 },
    { text: '4px', value: 4 },
    { text: '8px', value: 8 }
  ];
  private fill = false;
  private helpText = [
    'Click play/space to start recording',
    'Click reverse and then play to view recording',
    'Hold CTRL and click left mouse button to pan',
    'Scroll to zoom',
    'Click on drawing to remove it'
  ];

  private saveDialogOpen(dialog: boolean) {
    this.saveDialog = dialog;
  }

  private playToggle(e: KeyboardEvent): void {
    if (this.saveDialog) {
      return;
    }
    if (e.keyCode === 32 || e.key === ' ') {
      if (this.isPlaying) {
        this.controller!.pause();
      } else {
        this.controller!.start();
      }
    }
  }

  private panOn(e: KeyboardEvent): void {
    if (e.keyCode === 17) {
      this.panMode = 'on';
      this.controller!.stateToggle(true);
    }
  }

  private panOff(e: KeyboardEvent): void {
    if (e.keyCode === 17) {
      this.panMode = 'off';
      this.controller!.stateToggle(false);
    }
  }

  private async mounted() {
    this.container = new ServiceBuilder();
    this.controller = this.container.build(
      document.getElementById('svg')!,
      this.state,
      this.timer
    );
    if (this.id) {
      let player = this.container
        .getContainer()
        .resolve<PlayBaseController>(PlayBaseController);
      await Promise.all([
        RecordStore.LoadMetadata({ id: this.id, auth: this.$auth }),
        RecordStore.LoadRecording({ id: this.id, auth: this.$auth })
      ]);
      console.log(RecordStore.recording);
      player.setEventLog(RecordStore.recording);
    } else {
      this.controller.init([
        { targetAttr: StrokeAttributes.COLOR, value: this.color.value },
        { targetAttr: StrokeAttributes.WIDTH, value: this.width.value },
        {
          targetAttr: StrokeAttributes.BUFFER_SIZE,
          value: this.smoothness.value
        },
        { targetAttr: StrokeAttributes.FILL, value: undefined }
      ]);
    }
    window.addEventListener('keydown', this.panOn);
    window.addEventListener('keyup', this.panOff);
    window.addEventListener('keydown', this.playToggle);
  }

  private clear(): void {
    this.controller!.clear();
  }

  private setStrokeProperties(attr: StrokeAttributes): void {
    let value;
    switch (attr) {
      case StrokeAttributes.COLOR:
        value = this.color.value;
        break;
      case StrokeAttributes.WIDTH:
        value = this.width.value;
        break;
      case StrokeAttributes.BUFFER_SIZE:
        value = this.smoothness.value;
        break;
      case StrokeAttributes.FILL:
        value = this.fill ? this.fillColor.value : undefined;
        break;
      default:
        break;
    }
    this.controller!.setStrokeProperties({
      targetAttr: attr,
      value
    });
  }

  get isPlaying(): boolean {
    return this.state.state === AppStates.START;
  }

  private save(): void {
    RecordStore.SetRecording(this.controller!.export());
    this.dialog = true;
  }

  private printAccessToken(): void {
    this.$auth
      .getAccessTokenAsync({
        scopes: [
          process.env.VUE_APP_SCOPE_WRITE,
          process.env.VUE_APP_SCOPE_READ
        ]
      })
      .then(el => console.log(el.accessToken));
  }
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

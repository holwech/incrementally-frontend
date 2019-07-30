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
        <v-toolbar color="dark-grey" dark fixed app>
          <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
          <v-toolbar-title>Incrementally<sup><span style="color:yellow">beta</span></sup></v-toolbar-title>
            <!-- {{ state.state }} -->
            <v-spacer></v-spacer>
            <v-btn flat>{{
              state.timer.timeMonitor.minutes + ':' + state.timer.timeMonitor.seconds + ' / ' +
              state.timer.timeMonitor.lengthMinutes + ':' + state.timer.timeMonitor.lengthSeconds }}</v-btn>
            <HelpDialog>
              <v-flex>
                <v-list>
                  <v-list-tile v-for="text in helpText" :key="text">
                    <v-list-tile-action>
                      <v-icon>star</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content >
                      <v-list-tile-title v-text="text"></v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-flex>
            </HelpDialog>
            <v-btn color="white" @click="controller.restart()"><v-icon color="black">replay</v-icon></v-btn>
            <!-- <v-btn color="white" @click="controller.reverse()"><v-icon color="black">fast_rewind</v-icon></v-btn> -->
            <v-btn color="white" v-if="isPlaying" @click="controller.pause()"><v-icon color="black">pause</v-icon></v-btn>
            <v-btn color="white" v-else @click="controller.start()"><v-icon color="black">play_arrow</v-icon></v-btn>
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
                  item-text="text"
                  item-value="value"
                  :items="selectColorItems"
                  @input="setStrokeProperties('stroke')"
                  v-model="color"
                  label="Color"
                  return-object
                  color='black'
                ></v-select>
                <v-select
                  item-text="text"
                  item-value="value"
                  :items="selectWidthItems"
                  @input="setStrokeProperties('stroke-width')"
                  v-model="width"
                  label="Width"
                  return-object
                  color="black"
                ></v-select>
                <v-select
                  item-text="text"
                  item-value="value"
                  :items="selectColorItems"
                  @input="setStrokeProperties('fill')"
                  v-model="fillColor"
                  label="Fill color"
                  return-object
                  color="black"
                ></v-select>
                <v-checkbox
                  v-model="fill"
                  @change="setStrokeProperties('fill')"
                  label="Fill"
                ></v-checkbox>
            </SettingsDialog>
            <LoginButton />
          </v-toolbar>
        <v-content ma-0 pa-0 style="padding: 0px">
          <v-container fluid fill-height ma-0 pa-0>
            <v-layout
            justify-center
            align-center
            row wrap
            >
            <v-flex text-xs-center>
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="svg"
                  viewBox="0 0 1200 800"
                  enable-background="new 0 0 1200 800"
                  xml:space="preserve"
              >
              </svg>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SettingsDialog from '@/components/SettingsDialog.vue';
import HelpDialog from '@/components/HelpDialog.vue';
import { Controller } from 'draw-ts';
import AppState from 'draw-ts/lib/AppState';
import { BoardState, IStrokeProps } from 'draw-ts/lib/utils/boardInterfaces';
import { AppStates } from 'draw-ts/lib/utils/appInterfaces';
import { PlayStates } from 'draw-ts/lib/player/playInterfaces';
import { StrokeAttributes } from 'draw-ts/lib/event/eventInterfaces';
import LoginButton from '@/components/LoginButton.vue';

@Component({
  components: {
    SettingsDialog,
    HelpDialog,
    LoginButton,
  },
})
export default class Main extends Vue {
  private state = new AppState();
  private drawer = false;
  private controller!: Controller;
  private dialog = false;
  private recordColor = 'grey';
  private recording = false;
  private playing = false;
  private msg: string = 'Drawing board';
  private smoothness = { text: '4 - Sharp curves', value: 4};
  private slider = 0;
  private color = { text: 'Black', value: 'black'};
  private width = { text: '1px', value: 1};
  private fillColor = { text: 'Black', value: 'black'};
  private panMode: string = 'off';
  private selectSmoothnessItems = [
    { text: '1 - No smoothing', value: 1 },
    { text: '4 - Sharp curves', value: 4 },
    { text: '20 - Hyper smooth curves', value: 20 },
  ];
  private selectColorItems = [
    { text: 'Black', value: 'black' },
    { text: 'Blue', value: 'blue' },
    { text: 'Red', value: 'red' },
    { text: 'Green', value: 'green' },
  ];
  private selectWidthItems = [
    { text: '1px', value: 1 },
    { text: '2px', value: 2 },
    { text: '4px', value: 4 },
    { text: '8px', value: 8 },
  ];
  private fill = false;
  private helpText = [
    'Click play/space to start recording',
    'Click reverse and then play to view recording',
    'Hold CTRL and click left mouse button to pan',
    'Scroll to zoom',
    'Click on drawing to remove it',
  ];

  private playToggle(e: KeyboardEvent): void {
    if (e.keyCode === 32 || e.key === ' ') {
      if (this.isPlaying) {
        this.controller.pause();
      } else {
        this.controller.start();
      }
    }
  }

  private panOn(e: KeyboardEvent): void {
    if (e.keyCode === 17) {
      this.panMode = 'on';
      this.controller.stateToggle(true);
    }
  }

  private panOff(e: KeyboardEvent): void {
    if (e.keyCode === 17) {
      this.panMode = 'off';
      this.controller.stateToggle(false);
    }
  }

  private mounted(): void {
    this.controller = new Controller(
      'svg',
      this.state,
      [
        { targetAttr: StrokeAttributes.COLOR, value: this.color.value },
        { targetAttr: StrokeAttributes.WIDTH, value: this.width.value },
        { targetAttr: StrokeAttributes.BUFFER_SIZE, value: this.smoothness.value },
        { targetAttr: StrokeAttributes.FILL, value: undefined },
      ],
    );
    window.addEventListener('keydown', this.panOn);
    window.addEventListener('keyup', this.panOff);
    window.addEventListener('keydown', this.playToggle);
  }

  private clear(): void {
    this.controller.clear();
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
    this.controller.setStrokeProperties({
      targetAttr: attr,
      value,
    });
  }

  get isPlaying(): boolean {
    return this.state.state === AppStates.START;
    // if (this.state.state === AppStates.PLAYING) {
    //   this.playing = false;
    //   this.controller.pause();
    // } else {
    //   this.playing = true;
    //   this.controller.start();
    // }
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
  border: 1px solid black;
}

</style>
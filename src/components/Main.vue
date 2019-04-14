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
          <v-toolbar-title>Incrementally</v-toolbar-title>
            {{ state.state + '-' + state.subState }}
            <v-spacer></v-spacer>
            <v-btn flat>{{
              state.timer.timeMonitor.minutes + ':' + state.timer.timeMonitor.seconds + ' / ' +
              state.timer.timeMonitor.lengthMinutes + ':' + state.timer.timeMonitor.lengthSeconds }}</v-btn>
            <v-btn flat small>Record to draw | CTRL to zoom/pan</v-btn>
            <v-btn color="white" @click="controller.restart()"><v-icon color="black">replay</v-icon></v-btn>
            <!-- <v-btn color="white" @click="controller.reverse()"><v-icon color="black">fast_rewind</v-icon></v-btn> -->
            <v-btn color="white" v-if="isPlaying" @click="controller.pause()"><v-icon color="black">pause</v-icon></v-btn>
            <v-btn color="white" v-else @click="controller.start()"><v-icon color="black">play_arrow</v-icon></v-btn>
            <v-btn color="white" v-if="isRecording" @click="controller.recordOff()"><v-icon color="red">fiber_manual_record</v-icon></v-btn>
            <v-btn color="white" v-else @click="controller.recordOn()"><v-icon color="grey">fiber_manual_record</v-icon></v-btn>
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
            <v-toolbar-items class="hidden-sm-and-down">
              <v-select
                item-text="text"
                item-value="value"
                :items="selectColorItems"
                @input="setStrokeProperties"
                v-model="color"
                label="Color"
                return-object
                color='black'
              ></v-select>
            </v-toolbar-items>
            <v-toolbar-items class="hidden-sm-and-down">
              <v-select
                item-text="text"
                item-value="value"
                :items="selectWidthItems"
                @input="setStrokeProperties"
                v-model="width"
                label="Width"
                return-object
                color='black'
              ></v-select>
            </v-toolbar-items>
          </v-toolbar>
        <v-content ma-0 pa-0 style="padding: 0px">
            <!-- <v-container
              fluid
              grid-list-lg
            >
              <v-layout
                row
                wrap
              >
                <v-flex xs12>
                  <v-slider
                    v-model="slider"
                  ></v-slider>
                </v-flex>
              </v-layout>
            </v-container> -->
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
                  id="svgElement"
                  viewBox="0 0 1200 800"
                  enable-background="new 0 0 1200 800"
                  xml:space="preserve"
              >
              </svg>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
      <!-- <v-footer color="indigo" app inset>
        <span class="white--text">&copy; 2017</span>
      </v-footer> -->
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Controller } from 'draw-ts';
import AppState from 'draw-ts/lib/AppState';
import { BoardState, IStrokeProps } from 'draw-ts/lib/utils/boardInterfaces';
import { AppStates, AppSubState } from 'draw-ts/lib/utils/appInterfaces';
import { PlayStates } from 'draw-ts/lib/player/playInterfaces';

@Component
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

  private panOn(e: KeyboardEvent): void {
    if (e.keyCode === 17) {
      this.panMode = 'on';
      this.controller.setState(BoardState.PAN);
    }
  }

  private panOff(e: KeyboardEvent): void {
    if (e.keyCode === 17) {
      this.panMode = 'off';
      this.controller.setState(BoardState.DRAW);
    }
  }

  private mounted(): void {
    this.controller = new Controller(
      'svgElement',
      this.state,
      {
        color: this.color.value,
        width: this.width.value,
        bufferSize: this.smoothness.value,
      },
    );
    window.addEventListener('keydown', this.panOn);
    window.addEventListener('keyup', this.panOff);
  }

  private clear(): void {
    this.controller.clear();
  }

  private setStrokeProperties(): void {
    console.log(this.smoothness.value, this.color.value, this.width.value);
    this.controller.setStrokeProperties({
      color: this.color.value,
      width: this.width.value,
      bufferSize: this.smoothness.value,
    });
  }

  get isPlaying(): boolean {
    return this.state.subState === AppSubState.START;
    // if (this.state.state === AppStates.PLAYING) {
    //   this.playing = false;
    //   this.controller.pause();
    // } else {
    //   this.playing = true;
    //   this.controller.start();
    // }
  }

  get isRecording(): boolean {
    return this.state.state === AppStates.RECORDING;
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

#svgElement {
  border: 1px solid black;
}

</style>
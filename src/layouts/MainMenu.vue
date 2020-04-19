<template>
  <div id="main-wrapper" class="wave-top">
    <Toolbar>
      <router-link :to="{ name: 'Editor' }">
        <b-btn variant="outline-light">Open editor</b-btn>
      </router-link>
      <LoginButton />
    </Toolbar>
    <b-container id="main-container">
      <b-row>
        <b-col align-self="center" class="splash-text">
          <h1 class="text-center">Incremental.</h1>
          <p class="text-center">Go back later, fix mistakes, and improve your content incrementally</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card
            class="svg-card"
          >
            <template slot="header">
              Try it out yourself
              <b-button variant="dark" class="icon-button board-button" style="color:red;" v-if="board.isPlaying" @click="board.controller.pause()">
                <span class="material-icons">fiber_manual_record</span>
              </b-button>
              <b-button variant="outline-dark" class="icon-button board-button" v-else @click="board.controller.start()">
                <span class="material-icons">play_arrow</span>
              </b-button>
              <b-button variant="outline-dark" class="icon-button board-button" @click="board.controller.restart()">
                <span class="material-icons">replay</span>
              </b-button>
              <b-button variant="none" class="icon-button board-button" >
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
            </template>
            <div id='board'></div>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col align-self="center" class="splash-text">
          <h1 class="text-center">Always sharp.</h1>
          <p class="text-center">Create content with infinite resolution using Scalable Vector Graphics</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col align-self="center" class="splash-text">
          <h1 class="text-center">Interactive.</h1>
          <p class="text-center">Let your students learn by doing</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col align-self="center" class="splash-text">
          <h1 class="text-center">Learning redefined.</h1>
          <p class="text-center">The new way to create educational content</p>
        </b-col>
      </b-row>
    </b-container>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#007bff" fill-opacity="1" d="M0,224L60,234.7C120,245,240,267,360,256C480,245,600,203,720,208C840,213,960,267,1080,288C1200,309,1320,299,1380,293.3L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
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
export default class MainMenu extends Vue {
  private entries = Array<RecordingMetadata>();
  private board = new Board();

  private mounted(): void {
    this.board.create('board');
  }
}
</script>

<style lang='scss'>
.no-link-style a {
  color: white;
  text-decoration: none; /* no underline */
}

.svg-predisplay {
  width: 100%;
}

#main-container {
  padding: 30px;
}

.wave-top {
  background-image: url('../assets/wave-top.svg');
  background-repeat: no-repeat;
}

.wave-bottom {
  background-image: url('../assets/wave-bottom.svg');
  background-repeat: no-repeat;
  background-size: 100%;
}

.svg {
  width: 100%;
  height: 100%;
}

.board-button {
  margin-left: 20px;
}

.splash-text {
  margin: 50px;
  h1 {
    font-size: 5rem;
    text-shadow: 2px 2px #ffffff;
  }
  p {
    font-size: 1.5rem;
  }
}

.splash-text-last {
  margin-bottom: 0px;
}
</style>

<template>
  <div id="main-wrapper">
    <Toolbar>
      <router-link :to="{ name: 'Editor' }">
        <b-btn variant="outline-light">Open editor</b-btn>
      </router-link>
      <LoginButton />
    </Toolbar>
    <b-container id="main-container">
      <b-row>
        <b-col align-self="center" class="splash-text">
          <h1 class="text-center">Learning redefined.</h1>
          <p class="text-center">The new way to create educational content</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card
            class="svg-card"
          >
            <template slot="header">
              Try it out yourself - 
              <b-button variant="outline-dark">
                <i class="material-icons">fiber_manual_record</i>
              </b-button>
            </template>
            <Board></Board>
          </b-card>
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
import Board from '@/components/Board.vue';

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
    Toolbar,
    Board
  }
})
export default class MainMenu extends Vue {
  private entries = Array<RecordingMetadata>();

  private mounted(): void {
    this.$emit('test');
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
      .then(json => (this.entries = json));
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

#main-wrapper {
  background-image: url('../assets/wave.svg');
  background-repeat: no-repeat;
}

#main-wrapper > svg {
  display: block;
}

.svg {
  width: 100%;
  height: 100%;
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
</style>

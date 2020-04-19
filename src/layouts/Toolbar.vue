<template>
  <b-navbar
    toggleable="lg"
    type="dark"
    variant="primary"
  >
    <b-navbar-brand href="#">
      <router-link
        style="color:white"
        :to="{ name: 'MainMenu' }"
      >
        incrementally
      </router-link>
      <sup>
        <span
          style="color:yellow"
          @click="betaText"
        >beta</span>
      </sup>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />

    <b-collapse
      id="nav-collapse"
      is-nav
    >
      <b-navbar-nav class="ml-auto">
        <slot />
      </b-navbar-nav>
    </b-collapse>
    <b-icon
      v-if="showCollapseButton"
      @click="collapseToolbar = !collapseToolbar"
    >
      {{
        collapseToolbar ? 'keyboard_arrow_right' : 'keyboard_arrow_left'
      }}
    </b-icon>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Toolbar extends Vue {
  @Prop({ type: Boolean, default: false })
  private readonly showCollapseButton?: Boolean;

  private collapseToolbar = false;
  private betaText(): void {
    this.$auth
      .getAccessTokenAsync({
        scopes: [
          process.env.VUE_APP_SCOPE_WRITE,
          process.env.VUE_APP_SCOPE_READ
        ]
      })
      .then(token => console.log(token.accessToken));
    console.log(this.$auth.account);
  }
}
</script>
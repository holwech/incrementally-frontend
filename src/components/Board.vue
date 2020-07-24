<template>
  <svg
    id="svg"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
  />
</template>

<script lang="ts">
import 'reflect-metadata';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Service from 'drawify/lib/Controllers/Service';
import AppState from 'drawify/lib/State/AppState';
import ServiceBuilder from 'drawify';
import { StrokeAttributes } from 'drawify/lib/Interfaces/ActionInterfaces';
import { AppStates } from 'drawify/lib/Interfaces/AppInterfaces';
import { RecordController } from 'drawify/lib/Controllers/RecordController';
import Timer from 'drawify/lib/Timer/Timer';
import { PlayBaseController } from 'drawify/lib/Controllers/PlayBaseController';
import RecordingMetadata from '../models/RecordingMetadata';
import IRecordingEntry from '@/models/RecordingEntry';

@Component
export default class Board extends Vue {
  @Prop({ type: Boolean, default: true })
  private readonly play?: () => {};
  @Prop({ type: Boolean, default: true })
  private readonly restart?: () => {};

  private state = new AppState();
  private container?: ServiceBuilder;
  private controller?: Service = undefined;
  private timer = new Timer();

  @Watch('play')
  private onPlayChange(flag: boolean, oldFlag: boolean) {
    if (flag) {
      this.controller!.start();
    } else {
      this.controller!.pause();
    }
  }

  private mounted(): void {
    this.container = new ServiceBuilder();
    this.controller = this.container.build(
      document.getElementById('svg')!,
      this.state,
      this.timer
    );
    let player = this.container
      .getContainer()
      .resolve<PlayBaseController>(PlayBaseController);
    this.controller.init([
      { targetAttr: StrokeAttributes.COLOR, value: 'black' },
      { targetAttr: StrokeAttributes.WIDTH, value: 2 },
      {
        targetAttr: StrokeAttributes.BUFFER_SIZE,
        value: 4
      },
      { targetAttr: StrokeAttributes.FILL, value: false }
    ]);
  }
}
</script>

<style lang="scss">
#svg {
  height: 400px;
  width: 100%;
}
</style>
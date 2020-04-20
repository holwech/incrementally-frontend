import Service from 'drawify/lib/Controllers/Service';
import AppState from 'drawify/lib/State/AppState';
import ServiceBuilder from 'drawify';
import Timer from 'drawify/lib/Timer/Timer';
import { PlayBaseController } from 'drawify/lib/Controllers/PlayBaseController';
import { StrokeAttributes } from 'drawify/lib/Interfaces/ActionInterfaces';
import { AppStates } from 'drawify/lib/Interfaces/AppInterfaces';

export default class Board {
  private state = new AppState();
  private container?: ServiceBuilder;
  private timer = new Timer();

  public controller?: Service = undefined;
  public player?: PlayBaseController = undefined;
  public panMode: string = 'off';

  public create(parentId: string) {
    const modifier = '_drawify';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', parentId + modifier);
    document.getElementById(parentId)!.appendChild(svg);
    this.container = new ServiceBuilder();
    this.controller = this.container.build(svg as any, this.state, this.timer);
    this.player = this.container.getContainer().resolve<PlayBaseController>(PlayBaseController);
    this.controller.init([
      { targetAttr: StrokeAttributes.COLOR, value: 'black' },
      { targetAttr: StrokeAttributes.WIDTH, value: 2 },
      {
        targetAttr: StrokeAttributes.BUFFER_SIZE,
        value: 1
      },
      { targetAttr: StrokeAttributes.FILL, value: false }
    ]);
    window.addEventListener('keydown', this.panOn);
    window.addEventListener('keyup', this.panOff);
    window.addEventListener('keydown', this.playToggle);
  }

  public setStrokeAttribute(targetAttr: StrokeAttributes, value: string | number | boolean) {
    this.controller!.setStrokeProperties({ targetAttr: targetAttr, value });
  }

  private playToggle(e: KeyboardEvent): void {
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

  public clear(): void {
    this.controller!.clear();
  }

  get isPlaying(): boolean {
    return this.state.state === AppStates.START;
  }
}
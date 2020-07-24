import Service from 'drawify/lib/Controllers/Service';
import AppState from 'drawify/lib/State/AppState';
import ServiceBuilder from 'drawify';
import Timer from 'drawify/lib/Timer/Timer';
import { PlayBaseController } from 'drawify/lib/Controllers/PlayBaseController';
import { StrokeAttributes, IAction } from 'drawify/lib/Interfaces/ActionInterfaces';
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
    window.addEventListener('keydown', this.panOn.bind(this));
    window.addEventListener('keyup', this.panOff.bind(this));
    window.addEventListener('keydown', this.playToggle.bind(this));
  }

  public setStrokeAttribute(targetAttr: StrokeAttributes, value: string | number | boolean) {
    this.controller!.setStrokeProperties({ targetAttr: targetAttr, value });
  }

  private playToggle = (e: KeyboardEvent): void => {
    if (e.code === 'Space') {
      if (this.isPlaying) {
        this.controller!.pause();
      } else {
        this.controller!.start();
      }
    }
  }

  private panOn(e: KeyboardEvent): void {
    if (e.code === 'ControlLeft') {
      this.panMode = 'on';
      this.controller!.stateToggle(true);
    }
  }

  private panOff(e: KeyboardEvent): void {
    if (e.code === 'ControlLeft') {
      this.panMode = 'off';
      this.controller!.stateToggle(false);
    }
  }

  private setRecording(recording: IAction[]) {
    const player = this.container!.getContainer().resolve<PlayBaseController>(PlayBaseController);
    player.setEventLog(recording);
  }

  public clear(): void {
    this.controller!.clear();
  }

  get isPlaying(): boolean {
    return this.state.state === AppStates.START;
  }
}
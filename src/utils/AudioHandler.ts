import AudioRecorder from './AudioRecorder';

export default class AudioHandler {
    private audioRecorder: AudioRecorder;
    private audio?: HTMLAudioElement;
    private restarted = false;

    constructor(navigator: Navigator) {
        this.audioRecorder = new AudioRecorder(navigator);
    }

    public async start() {
        await this.audioRecorder.init();
        this.audioRecorder.start();
        if (this.restarted) {
            this.restarted = false;
            this.audio?.play();
        }
    }

    public stop() {
        this.audioRecorder.stop();
    }

    public restart() {
        this.restarted = true;
        this.audio = new Audio(URL.createObjectURL(this.audioRecorder.toBlob()));
    }
}
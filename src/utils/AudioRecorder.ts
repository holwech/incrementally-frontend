export default class AudioRecorder {
    private recordedChunks: Blob[] = [];
    private mediaRecorder?: MediaRecorder;
    private dataAvailableListenerFn: (e: BlobEvent) => void;
    private options: MediaRecorderOptions = {
        mimeType: 'audio/webm'
    }
    private nav: Navigator;

    constructor(navigator: Navigator, options?: MediaRecorderOptions) {
        this.nav = navigator;
        if (options) this.options = this.options;
        this.dataAvailableListenerFn = this.onDataAvailable;
    }

    public async init() {
        let stream = await this.promptMicAccess();
        this.mediaRecorder = new MediaRecorder(stream, this.options)
        this.mediaRecorder.ondataavailable = this.onDataAvailable.bind(this);
    }

    public async start() {
        // Possibly not working in Firefox, skip for now
        // if (await this.checkMicAccess() !== 'granted') {
        //    return false;
        // }
        this.mediaRecorder!.start();
        return true;
    }

    public stop() {
        this.mediaRecorder!.stop();
    }

    public flush() {
        this.recordedChunks = [];
    }

    public toBlob() {
        console.log(this.recordedChunks);
        return new Blob(this.recordedChunks, { type: 'audio/webm' });
    }

    // Still in experimental, does not work in Firefox?
    public async checkMicAccess() {
        let result = await this.nav.permissions.query({ name: 'microphone' });
        result.onchange = function() {
        };
        return result.state; // granted, prompt, denied
    }

    public async promptMicAccess() {
        return await this.nav.mediaDevices.getUserMedia({ audio: true, video: false });
    }

    private onDataAvailable(e: BlobEvent) {
        if (e.data.size > 0) {
            this.recordedChunks.push(e.data);
        }
    }
}
export default class AudioRecorder {
    private recordedChunks: Blob[] = [];
    private mediaRecorder?: MediaRecorder;
    private options: MediaRecorderOptions = {
        mimeType: 'audio/webm'
    }
    private nav: Navigator;

    constructor(navigator: Navigator, options?: MediaRecorderOptions) {
        this.nav = navigator;
        if (options) this.options = this.options;
    }

    public async init() {
        let stream = await this.promptMicAccess();
        this.mediaRecorder = new MediaRecorder(stream, this.options);
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
        let reader = new FileReader();
        reader.onload = (ev) {
            ev.target?.result
        }
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

    private async concatAudio(blob: Blob) {
        var blob="YOUR AUDIO BLOB";
        var f = new FileReader();
        f.onload = this.processBuffer;
        f.readAsArrayBuffer(blob);
    }

    private processBuffer(e) {
        let audioContext = new AudioContext();
        audioContext.decodeAudioData(e.target.result, function (buffer) {
            arrayBuffer.push(buffer);
            if (arrayBuffer.length > 1) {
                resultantbuffer = appendBuffer(arrayBuffer[0], arrayBuffer[1]);
                arrayBuffer = [];
                arrayBuffer.push(resultantbuffer);
            }
            else {
                resultantbuffer = buffer;
            }
    }

    function appendBuffer(buffer1, buffer2) {
        ///Using AudioBuffer
        var numberOfChannels = Math.min(buffer1.numberOfChannels, buffer2.numberOfChannels);
        var tmp = recordingAudioContext.createBuffer(numberOfChannels, (buffer1.length + buffer2.length), buffer1.sampleRate);
        for (var i = 0; i < numberOfChannels; i++) {
            var channel = tmp.getChannelData(i);
            channel.set(buffer1.getChannelData(i), 0);
            channel.set(buffer2.getChannelData(i), buffer1.length);
        }
        return tmp;

    }
}
class AudioManager {
    constructor() {
        this.clips = {};
        this.context = null;
        this.gainNode = null;
        this.loaded = false;
        this.filter = null;

        this.defaultFrequency = 6600;
        this.lowFrequency = 150;
    }

    init() {
        this.context = new AudioContext();
        this.gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode();
        this.gainNode.connect(this.context.destination);
    }

    load(path, callback) {
        if(this.clips[path]) {
            callback(this.clips[path]);
            return;
        }

        let clip = {
            path: path,
            buffer: null,
            loaded: false
        };

        clip.play = function(volume, loop) {
            getAudioManager().play(this.path, { looping: loop ? loop : false, volume: volume ? volume : 1 } );
        }

        this.clips[path] = clip;

        let request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            getAudioManager().context.decodeAudioData(request.response,
                function(buffer) {
                    clip.buffer = buffer;
                    clip.loaded = true;
                    callback(clip);
                    console.log(`Loaded clip: ${clip.path}`);
                }
            );
        };

        request.send();
    }

    loadArray(array) {
        for(let sound of array) {

            this.load(sound, function() {

                if(array.length === Object.keys(getAudioManager().clips).length) {
                    //console.log(`invoked all`);
                    for(let sd in getAudioManager().clips) {
                        if(!getAudioManager().clips[sd].loaded) {
                            return;
                        }
                    }
                    getAudioManager().loaded = true;
                }

            });

        }
    }

    play(path, settings) {
        if(!getAudioManager().loaded){
            return false;
        }

        let looping = false;
        let volume = 1;

        if(settings) {
            if(settings.looping)
                looping = settings.looping;

            if(settings.volume)
                volume = settings.volume;
        }

        let sd = this.clips[path];

        if(sd === null)
            return false;

        let sound = this.context.createBufferSource();
        sound.buffer = sd.buffer;
        sound.connect(getAudioManager().gainNode);
        sound.loop = looping;
        getAudioManager().gainNode.gain.value = volume;

        sound.start(0);
        return true;

    }

    playWorldSound(path, x, y) {
        if(getGameManager().player === null) {
            return;
        }

        let viewSize = Math.max(getMapManager().view.w, getMapManager().view.h) * 0.5;

        let dx = Math.abs(getGameManager().player.pos_x - x);
        let dy = Math.abs(getGameManager().player.pos_y - y);

        let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        let norm = distance / viewSize;

        if(norm > 1)
            norm = 1;

        let volume = 1.0 - norm;

        if(!volume)
            return;

        getAudioManager().play(path, { looping: false });
    }

    stopAll() {
        this.gainNode.disconnect();

        this.gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode();

        this.gainNode.connect(this.context.destination);
    }

    frequencyRamp(fr, time) {
        getAudioManager().filter.frequency.exponentialRampToValueAtTime(fr, getAudioManager().context.currentTime + time);
    }
}
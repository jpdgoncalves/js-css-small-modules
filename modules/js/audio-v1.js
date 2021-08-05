import {loadJSON} from "./loader.js";

export class Music {
    /**
     * 
     * @param {string} name Name of the music.
     * @param {string} src Source path to the music file.
     */
    constructor(name, src) {
        this._name = name;
        this._src = src;
        this._audio = new Audio(src);
    }

    get name() {
        return this._name;
    }

    get src() {
        return this._src;
    }

    get volume() {
        return this._audio.volume;
    }

    set volume(value) {
        value = value > 1 ? 1 : value;
        value = value < 0 ? 0 : value;
        this._audio.volume = value;
    }

    get paused() {
        return this._audio.paused;
    }

    get muted() {
        return this._audio.muted;
    }

    set muted(value) {
        this._audio.muted = value;
    } 

    play() {
        this._audio.play();
    }

    pause() {
        this._audio.pause();
    }

    stop() {
        this._audio.pause();
        this._audio.currentTime = 0;
    }
}

export class MusicCollection {
    constructor() {
        /**
         * @type {Map<string, Music>}
         */
        this._musicMap = new Map();
        /**
         * @type {Music}
         */
        this._current = undefined;
    }

    get current() {
        return this._current;
    }

    /**
     * 
     * @param {Music} music 
     */
    add(music) {
        if (this._musicMap.has(music.name)) {
            console.warn(`There is already a music with ${music.name}`);
            return;
        }

        this._musicMap.set(music.name, music);
    }

    /**
     * 
     * @param {string} name 
     */
    get(name) {
        return this._musicMap.get(name);
    }

    /**
     * Plays a music if it exists.
     * @param {string} name The name of the music to play.
     */
    play(name) {
        const music = this._musicMap.get(name);
        this._current?.stop();
        this._current = music;
        this._current?.play();
    }

    pause() {
        this._current?.pause();
    }

    stop() {
        this._current?.stop();
        this._current = undefined;
    }
}

/**
 * Loads a collection of musics specified in a JSON file.
 * @param {string} src Source path to the JSON file. 
 */
export async function loadMusicCollection(src) {
    const json = await loadJSON(src);
    const musicCollection = new MusicCollection();

    for (let key in json) {
        musicCollection.add(new Music(key, json[key]));
    }

    return musicCollection;
}
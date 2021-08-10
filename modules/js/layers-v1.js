/**
 * @callback layerCreator
 * @param {string} name
 * @param {number} width
 * @param {number} height
 * @returns {[HTMLCanvasElement, CanvasRenderingContext2D]}
 */

/**
 * 
 * @param {string} name
 * @param {number} width
 * @param {number} height
 * @returns {[HTMLCanvasElement, CanvasRenderingContext2D]}
 */
function _createLayer(name, width, height) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    
    canvas.dataset.layerName = name;
    canvas.width = width;
    canvas.height = height;
    canvas.classList.add("canvas-layer");

    return [canvas, context];
}


/**
 * Configuration class to initialize a Layers class instance.
 * By default it will set the canvas layers to 360x240, it has a layer called 'main'
 * and the container for the layers will be the document body.
 */
export class LayersConfig {
    /**
     */
    constructor() {
        /**
         * @private
         */
        this._width = 360;
        /**
         * @private
         */
        this._height = 240;
        /**
         * @type {string[]}
         * @private
         */
        this._layers = ["main"];
        /**
         * @private
         * @type {layerCreator}
         */
        this._layerCreator = _createLayer;
        /**
         * @private
         */
        this._container = document.body;
    }

    /**
     * 
     * @param {number} width Width of the layers in pixels.
     * @param {number} height Height of the layers in pixels.
     */
    dimensions(width, height) {
        this._width = width;
        this._height = height;
        return this;
    }

    /**
     * 
     * @param  {...string} names The names of the layers. The last will be the one in front.
     */
    layers(...names) {
        this._layers = names;
        return this;
    }

    /**
     * 
     * @param {layerCreator} creator The constructor for the layers.
     */
    layerCreator(creator) {
        this._layerCreator = creator;
    }

    /**
     * 
     * @param {HTMLElement} element The element that will contain these layers.
     */
    container(element) {
        this._container = element;
        return this;
    }
}


/**
 * Class representing canvas layers.
 */
export class Layers {
    /**
     * 
     * @param {LayersConfig} config 
     */
    constructor(config) {
        /**
         * @private
         */
        this._width = config._width;
        /**
         * @private
         */
        this._height = config._height;
        /**
         * @type {Map<string, [HTMLCanvasElement, CanvasRenderingContext2D]>}
         * @private
         */
        this._layers = new Map();
        /**
         * @private
         * @type {layerCreator}
         */
        this._layerCreator = config._layerCreator;
        /**
         * @private
         */
        this._container = config._container;

        for (let layerName of config._layers) {
            this.add(layerName);
        }
    }

    /**
     * Adds a new layer if it doesn't exits
     * @param {string} layerName
     */
    add(layerName) {
        if (this._layers.has(layerName)) {
            console.warn(`Layers '${layerName}' already exists`);
            return;
        }

        const layer = this._layerCreator(layerName, this._width, this._height);
        this._layers.set(layerName, layer);
        this._container.appendChild(layer[0]);
    }

    /**
     * Removes a layer if it exists.
     * @param {string} layerName 
     */
    remove(layerName) {
        const layer = this._layers.get(layerName);
        if (!layer) return;
        
        this._layers.delete(layerName);
        this._container.removeChild(layer[0]);
    }

    /**
     * Returns the layer canvas context if it exists
     * @param {string} layerName 
     * @returns {[HTMLCanvasElement, CanvasRenderingContext2D] | undefined}
     */
    get(layerName) {
        return this._layers.get(layerName);
    }
}
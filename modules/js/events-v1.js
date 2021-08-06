// Exported classes

/**
 * Class used to emit events. Listeners can then be attached to it to react to the events.
 */
export class EventEmitter {
    constructor() {
        /**
         * @private
         * @type {Map<string, Set<Function>>}
         */
        this._mappings = new Map();
    }

    /**
     * Attaches a listener to the specified event.
     * @param {string} name Name of the event to listen.
     * @param {Function} listener The function to be called when the event occurs. 
     */
    listen(name, listener) {
        this._get(name).add(listener);
    }

    /**
     * Removes a listener from the specified event.
     * @param {string} name Name of the event where the listener is.
     * @param {Function} listener The listener to remove.
     */
    unlisten(name, listener) {
        this._get(name).delete(listener);
    }

    /**
     * Emits the specified event.
     * @param {string} name The name of the event to emit.
     * @param {any} data Data to be passed to the listeners.
     */
    emit(name, data) {
        const listeners = this._get(name);
        for (let listener of listeners.values()) {
            listener(data);
        }
    }

    /**
     * @private
     * @param {string} name 
     * @returns 
     */
    _get(name) {
        if (!this._mappings.has(name)) {
            this._mappings.set(name, new Set());
        }

        return this._mappings.get(name);
    }
}


/**
 * Class used to create and configure a function that maps the different values
 * of a property of an event to a specified callback.
 */
export class EventPropertyMapper {
    /**
     * @private
     */
    static _NO_OP = () => {}
    /**
     * 
     * @param {string} mappingProperty Name of the property of the event to map.
     */
    constructor(mappingProperty) {
        /**
         * @private
         */
        this._mappedProperty = mappingProperty;
        /**
         * @private
         * @type {Map<string, Function>}
         */
        this._mappings = new Map();
        /**
         * @private
         */
        this._mapper = (event) => this._get(event[this._mappedProperty])(event);
    }

    get mapper() {
        return this._mapper;
    }

    /**
     * Sets/Overwrites a mapping for a value of the event property.
     * @param {string} propertyValue The value of the property to be mapped. 
     * @param {Function} callback The callback for when the property has the previously specified value. 
     */
    set(propertyValue, callback) {
        this._mappings.set(propertyValue, callback);
    }

    /**
     * Deletes a mapping if it exists.
     * @param {string} propertyValue Value of the property that was mapped.
     */
    delete(propertyValue) {
        this._mappings.delete(propertyValue);
    }

    clear() {
        this._mappings.clear();
    }

    /**
     * @private
     * @param {string} propertyValue  
     */
    _get(propertyValue) {
        const callback = this._mappings.get(propertyValue);
        return callback ? callback : EventMapper._NO_OP;
    }
}

// Exported Functions

/**
 * Creates a function which can be used to redirect events from a
 * source to a destination.
 * @param {EventEmitter} destEmitter The destination event emitter. 
 * @param {string} destEventName Name of the destination event.
 */
export function redirecter(destEmitter, destEventName) {
    return (event) => destEmitter.emit(destEventName, event);
}

export default class Ticker {

    /**
     * A Ticker which calls a provided function in periods equal to the provided interval.
     * Override the ontick property with a callback and then call start() to start the ticker.
     * @param {number} [interval] Minimum time between ticks. Defaults to 1000 / 60 which means 60 ticks per second. 
     */
    constructor(interval = 1000 / 60) {

        this.interval = interval;
        /**
         * @callback onTickCallback
         * @param {OnTickEvent} event
         * @return {void}
         */
        /**
         * This property is to be overriden
         * @type {onTickCallback}
         */
        this.ontick = (event) => {console.log("Tick event: ", event)};
        this.tickerID = undefined;
    }

    /**
     * Gets the number of ticks per second as interval * 1000
     */
    get tps() {
        return this.interval * 1000;
    }

    /**
     * Sets the number of ticks per second. This will change the interval value.
     */
    set tps(value) {
        this.interval = 1000 / value;
    }

    get running() {
        this.tickerID !== undefined;
    }

    /**
     * Starts the ticker.
     */
    start() {
        if (this.running) console.warn("Ticker is already running. Ignoring call.");

        let accumulated = 0;
        let previousTime = performance.now();

        const ticker = (total) => {
            this.tickerID = requestAnimationFrame(ticker);

            accumulated += total - previousTime;
            previousTime = total;

            while (accumulated >= this.interval) {
                accumulated -= this.interval;

                OnTickEvent.total = total;
                OnTickEvent.interval = this.interval;

                this.ontick(OnTickEvent);
            }
        }

        this.tickerID = requestAnimationFrame(ticker);
    }

    /**
     * Stops the ticker.
     */
    stop() {
        cancelAnimationFrame(this.tickerID);
        this.tickerID = undefined;
    }
}

const OnTickEvent = {
    total: 0,
    interval: 0
};
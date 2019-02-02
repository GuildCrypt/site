const _listeners = Symbol("listeners");

/**
 * Use or extend this class to trigger and listen to events
 * @class
 */
export default class EventClass {

    constructor() {
        this[_listeners] = {};
    }

    /**
     * Adds a listener for the given event
     * @param {string} event - the event to listen to
     * @param {function} listener - the callback called when the given event is emitted
     * @returns {function} - event.off(event, listener);
     */
    on(event, listener) {
        if (typeof this[_listeners][event] === "undefined") {
            this[_listeners][event] = [];
        }
        this[_listeners][event].push(listener);
        return listener;
    }

    /**
     * Adds an one-shot listener for the given event
     * @param {string} event - the event to listen to
     * @param {function} listener - the callback called once when the given event is emitted
     */
    once(event, listener) {
        const onceListener = () => {
            this.off(event, onceListener);
            listener();
        };
        this.on(event, onceListener);
    }

    /**
     * Removes the listener for the given event, or removes all listeners for the given event if listener is undefined
     * @param {string} event
     * @param {function} [listener]
     */
    off(event, listener) {
        if (typeof this[_listeners][event] !== "undefined") {
            if (typeof listener === "undefined") {
                this[_listeners][event] = [];
            } else {
                const listenerIndex = this[_listeners][event].lastIndexOf(listener);
                if (listenerIndex !== -1) {
                    this[_listeners][event].splice(listenerIndex, 1);
                }
            }
        }
    }

    /**
     * Emits an event
     * @param {string} event - all listeners to this event will be notified
     * @param {...*} args - all listeners to this event will be notified with the given arguments
     */
    emit(event, ...args) {
        const listeners = this[_listeners][event];
        if (typeof listeners !== "undefined") {
            for (const listener of listeners) {
                listener.call(this, ...args);
            }
        }
    }

}

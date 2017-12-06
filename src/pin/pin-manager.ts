import LedManager from '../led/led-manager';

export default class PinManager {
    private static _instance = new PinManager();

    private pins: any[];
    private ledManager = new LedManager();

    public static getInstance() {
        return PinManager._instance;
    }

    private constructor() {

    }

    public setPins(pins) {
        this.pins = pins;
        this.ledManager.addLedsFromPins(pins);
    }

    public getPins(): any[] {
        return this.pins;
    }

    public getLedManager(): LedManager {
        return this.ledManager;
    }

}

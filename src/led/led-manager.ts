import GpioFactory from '../gpio/gpio-factory';
import IGpio from '../gpio/igpio';

export default class LedManager {

    public leds = {};
    private driver;

    constructor() {
        this.driver = new GpioFactory(process.env.GPIO_DRIVER).getClass();

    }

    public getLed(pin): IGpio {
        return this.leds[pin];
    }

    public addLed(pin, enabled): any {
        const led = new this.driver(pin, 'out');
        led.writeSync(enabled);
        this.leds[pin] = led;
        return led;
    }

    public addLedsFromPins(pins): void {
        pins.forEach((pin) => {
            this.addLed(pin.pin, pin.enabled);
        });
    }

    public unexport() {
        for (const i of Object.keys(this.leds)) {
            const led = this.leds[i];
            led.writeSync(false);
            led.unexport();
        }
    }
}

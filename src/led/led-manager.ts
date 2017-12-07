import GpioFactory from '../gpio/gpio-factory';
import { scheduleJob } from 'node-schedule';
import ILed from '../interfaces/iled';

export default class LedManager {

    public leds = {};
    private driver;

    constructor() {
        this.driver = new GpioFactory(process.env.GPIO_DRIVER).getClass();

    }

    public getLed(pin): ILed {
        return this.leds[pin];
    }

    public addLed(pin): ILed {
        const led = new this.driver(pin.pin, 'out');
        led.writeSync(pin.enabled);
        const jobs = [];
        if (pin.schedules) {
            pin.schedules.forEach((schedule) => {
                const job = scheduleJob(schedule.rule, () => {
                    setTimeout(() => {
                            led.switch(schedule.state);
                    }, schedule.delay * 1000);

                });

                jobs.push(job);
            });
        }

        return this.leds[pin.pin] = {
            led,
            jobs,
        };
    }

    public addLedsFromPins(pins): void {
        pins.forEach((pin) => {
            this.addLed(pin);
        });
    }

    public unexport() {
        for (const i of Object.keys(this.leds)) {
            const led = this.leds[i].led;
            led.writeSync(false);
            led.unexport();
        }
    }
}

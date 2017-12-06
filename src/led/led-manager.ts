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
                jobs.push(scheduleJob(schedule.rule, () => {
                    if (schedule.action == 'turn_on') {
                        led.switch(true);
                    }

                    setTimeout(() => {
                        led.switch(false);
                    }, schedule.duration * 1000);
                }));
            });
        }

        return this.leds[pin.pin] = {
            led: led,
            jobs: jobs,
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

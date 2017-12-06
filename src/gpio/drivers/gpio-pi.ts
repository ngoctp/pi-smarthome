import * as Gpio from 'onoff';

import IGpio from '../igpio';

export default class GpioPi implements IGpio {
    private gpio: any;

    constructor(gpio: number, direction: string) {
        this.gpio = new Gpio(gpio, direction);
    }

    public readSync(): boolean {
        return this.gpio.readSync() ? true : false;
    }

    public writeSync(value: boolean) {
        return this.gpio.writeSync(value);
    }

    public unexport() {
        return this.gpio.unexport();
    }

    public switch(value: boolean) {
        if (value !== this.readSync()) { // only change LED if status has changed
            this.writeSync(value); // turn LED on or off
        }
    }
}

import { Gpio } from 'onoff';

import IGpio from '../igpio';

export default class GpioPi implements IGpio {
    private gpio: any;
    private pin: number;
    private direction: string;

    constructor(pin: number, direction: string) {
        this.pin = pin;
        this.direction = direction;
        this.gpio = new Gpio(pin, direction);
        this.writeSync(false);
    }

    public readSync(): boolean {
        const result = this.gpio.readSync() ? false : true;
        console.log('read pin[' + this.pin + ']:', result);
        return result;
    }

    public writeSync(value: boolean) {
        console.log('write pin[' + this.pin + ']:', value)
        return this.gpio.writeSync(value ? 0 : 1);
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

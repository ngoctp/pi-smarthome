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
}

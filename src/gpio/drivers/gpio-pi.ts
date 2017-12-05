import IGpio from '../igpio';
import * as Gpio from 'onoff';

export default class GpioPi implements IGpio {
    private gpio: any;

    constructor(gpio: number, direction: string) {
        this.gpio = new Gpio(gpio, direction);
    }

    readSync(): boolean {
        return this.gpio.readSync() ? true : false;
    }

    writeSync(value: boolean) {
        return this.gpio.writeSync(value);
    }

    unexport() {
        return this.gpio.unexport();
    }
}

import IGpio from "../igpio";

export default class GpioEmulator implements IGpio {
    private enabled: boolean = false;
    private gpio: number;
    private direction: string;

    constructor(gpio: number, direction: string) {
        this.gpio = gpio;
        this.direction = direction;
    }

    readSync(): boolean {
        console.log('readSync: ', this.enabled);
        return this.enabled;
    }

    writeSync(value: boolean) {
        console.log('writeSync: ', value);
        this.enabled = value;
    }

    unexport() {
        console.log('unexport');
    }
}

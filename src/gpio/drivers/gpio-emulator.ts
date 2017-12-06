import IGpio from '../igpio';

export default class GpioEmulator implements IGpio {
    private enabled = false;
    private gpio: number;
    private direction: string;

    constructor(gpio: number, direction: string) {
        this.gpio = gpio;
        this.direction = direction;
    }

    public readSync(): boolean {
        console.log('readSync[' + this.gpio + ']: ', this.enabled);
        return this.enabled;
    }

    public writeSync(value: boolean) {
        console.log('writeSync[' + this.gpio + ']: ', value);
        this.enabled = value;
    }

    public unexport() {
        console.log('unexport[' + this.gpio + ']');
    }

    public switch(value: boolean) {
        if (value !== this.readSync()) { // only change LED if status has changed
            this.writeSync(value); // turn LED on or off
        }
    }
}

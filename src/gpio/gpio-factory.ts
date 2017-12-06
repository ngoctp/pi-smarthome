import GpioEmulator from './drivers/gpio-emulator';
import GpioDriver from './gpio-driver';
import GpioPi from './drivers/gpio-pi';

export default class GpioFactory {
    private driver: string;

    constructor(driver: string) {
        this.driver = driver;
    }

    public getClass() {
        switch (this.driver) {
            case GpioDriver.EMULATOR:
                return GpioEmulator;
            case GpioDriver.PI:
                return GpioPi;
            default:
                throw new Error('Driver "' + this.driver + '" is invalid');
        }
    }
}

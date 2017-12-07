import GpioEmulator from './drivers/gpio-emulator';
import GpioDriver from './gpio-driver';
declare var require: any;


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
                try {
                    return require('./drivers/gpio-pi').default;
                } catch (e) {
                    throw new Error('Not running on PI, change GPIO_DRIVER to "emulator" for testing!');
                }
            default:
                throw new Error('Driver "' + this.driver + '" is invalid');
        }
    }
}

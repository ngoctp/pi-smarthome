import IGpio from '../gpio/igpio';

export default interface ILed {
    led: IGpio;
    jobs: any[];
}

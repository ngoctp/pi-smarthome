import IPin from '../interfaces/ipin';

export default class Pin {

    private static _instance: Pin = new Pin();

    private pins = [
        {
            name: 'Living room light',
            pin: 17,
            enabled: false,
        },
        {
            name: 'Kitchen light',
            pin: 18,
            enabled: false,
        },
        {
            name: 'Parent\'s room light',
            pin: 27,
            enabled: false,
        },
        {
            name: 'Children\'s room light',
            pin: 22,
            enabled: false,
        },
        {
            name: 'Balcony light',
            pin: 23,
            enabled: false,
        },
        {
            name: 'Reading lamp',
            pin: 24,
            enabled: false,
        },
        {
            name: 'Front door light',
            pin: 25,
            enabled: false,
        },
        {
            name: 'Water pump',
            pin: 12,
            enabled: false,
        },
    ];

    public static getInstance(): Pin {
        return Pin._instance;
    }

    constructor() {
        if (Pin._instance) {
            throw new Error('Error: Instantiation failed');
        }
    }

    getList(): Promise<IPin[]> {
        return new Promise((resolve) => {
            resolve(this.pins);
        });
    }
}

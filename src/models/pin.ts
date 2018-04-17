import IPin from '../interfaces/ipin';

export default class Pin {

    private static _instance: Pin = new Pin();

    // gpio 2 = pin 3
    // gpio 3 = pin 5
    // gpio 4 = pin 7
    // gpio 14 = pin 8
    // gpio 15 = pin 10
    // gpio 17 = pin 11
    // gpio 18 = pin 12
    // gpio 27 = pin 13
    // gpio 22 = pin 15
    // gpio 23 = pin 16
    // gpio 24 = pin 18
    // gpio 10 = pin 19
    // gpio 9 = pin 21
    // gpio 25 = pin 22
    // gpio 11 = pin 23
    // gpio 8 = pin 24
    // gpio 7 = pin 26
    // gpio 5 = pin 29
    // gpio 6 = pin 31
    // gpio 12 = pin 32
    // gpio 13 = pin 33
    // gpio 19 = pin 35
    // gpio 16 = pin 36
    // gpio 26 = pin 37
    // gpio 20 = pin 38
    // gpio 21 = pin 40
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
            schedules: [
                {
                    rule: '0 7 * * *',
                    state: true,
                },
                {
                    rule: '15 7 * * *',
                    state: false,
                    delay: 10,
                },
            ],
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

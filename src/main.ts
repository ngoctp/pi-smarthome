import * as dotenv from 'dotenv';
(dotenv as any).config();

import GpioFactory from './gpio/gpio-factory';
const Gpio = new GpioFactory(process.env.GPIO_DRIVER).getClass();

import * as express from 'express';
const app = express();
import { Server } from 'http';
const server = new Server(app);
import * as socketIO from 'socket.io';
const io = socketIO(server);

server.listen(process.env.PORT);
app.use('/', (express as any).static(__dirname + '/../public'));

const pins = [
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

const leds = initLEDs(pins);

function initLEDs(pinList) {
    const result = {};
    pinList.forEach((pin) => {
        const led = new Gpio(pin.pin, 'out');
        led.writeSync(pin.enabled);
        result[pin.pin] = led;
    });
    return result;
}

io.on('connection', (socket) => {
    socket.emit('pin/list', responsePinList());
    socket.on('pin/enable', (data) => { // get light switch status from client
        const pin = data.pin;
        const enabled = data.enabled;
        if (leds[pin] && enabled !== leds[pin].readSync()) { // only change LED if status has changed
            leds[pin].writeSync(enabled); // turn LED on or off
        }
    });
});

function responsePinList() {
    const result = [];
    pins.forEach((pin) => {
        result.push((Object as any).assign({}, pin, {
            enabled: leds[pin.pin].readSync(),
        }));
    });
    return result;
}
// console.log(app);

console.log(process.env.PORT);
console.log(process.env.GPIO_DRIVER);
// process.exit();

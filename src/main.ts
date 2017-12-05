import * as dotenv from 'dotenv';
(dotenv as any).config();

import GpioFactory from './gpio/gpio-factory';
const Gpio = new GpioFactory(process.env.GPIO_DRIVER).getClass();

import * as express from 'express';
const app = express();
import { Server } from 'http';
const server = new Server(app);
import * as socketIO from 'socket.io';

import Pin from './models/pin';
import IPin from './interfaces/ipin';

const leds = {};
let pins: IPin[] = null;

Pin.getInstance().getList().then((response) => {
    pins = response;
    pins.forEach((pin) => {
        const led = new Gpio(pin.pin, 'out');
        led.writeSync(pin.enabled);
        leds[pin.pin] = led;
    });

}).then(() => {
    const io = socketIO(server);
    io.on('connection', (socket) => {
        socket.emit('pin/list', (() => {
            const result = [];
            pins.forEach((pin) => {
                result.push((Object as any).assign({}, pin, {
                    enabled: leds[pin.pin].readSync(),
                }));
            });
            return result;
        })());
        socket.on('pin/switch', (data) => { // get light switch status from client
            const pin = data.pin;
            const enabled = data.enabled;
            if (leds[pin] && enabled !== leds[pin].readSync()) { // only change LED if status has changed
                leds[pin].writeSync(enabled); // turn LED on or off
            }
        });
    });

}).then(() => {
    app.use('/', (express as any).static(__dirname + '/../public'));
    server.listen(process.env.PORT);

});

process.on('SIGINT', () => { // on ctrl+c
    pins.forEach((pin) => {
        const led = leds[pin.pin];
        led.writeSync(false);
        led.unexport();
    });
    process.exit(); // exit completely

});

import * as dotenv from 'dotenv';
(<any>dotenv).config();

import GpioFactory from './gpio/gpio-factory';
var Gpio = new GpioFactory(process.env.GPIO_DRIVER).getClass();

import * as express from 'express';
const app = express();
import { Server } from 'http';
const server = new Server(app);
import * as socket from 'socket.io';
const io = socket(server);

server.listen(process.env.PORT);
app.use('/', (<any>express).static(__dirname + '/../public'));

var pins = [
    {
        name: 'Living room light',
        pin: 17,
        enabled: false
    },
    {
        name: 'Kitchen light',
        pin: 18,
        enabled: false
    },
    {
        name: 'Parent\'s room light',
        pin: 27,
        enabled: false
    },
    {
        name: 'Children\'s room light',
        pin: 22,
        enabled: false
    },
    {
        name: 'Balcony light',
        pin: 23,
        enabled: false
    },
    {
        name: 'Reading lamp',
        pin: 24,
        enabled: false
    },
    {
        name: 'Front door light',
        pin: 25,
        enabled: false
    },
    {
        name: 'Water pump',
        pin: 12,
        enabled: false
    }
];

var leds = initLEDs(pins);

function initLEDs(pins) {
    var leds = {};
    pins.forEach(function(pin) {
        var led = new Gpio(pin.pin, 'out');
        led.writeSync(pin.enabled);
        leds[pin.pin] = led;
    });
    return leds;
}

io.on('connection', function (socket) {
    socket.emit('pin/list', responsePinList());
    socket.on('pin/enable', function(data) { //get light switch status from client
        var pin = data.pin;
        var enabled = data.enabled;
        if (leds[pin] && enabled != leds[pin].readSync()) { //only change LED if status has changed
            leds[pin].writeSync(enabled); //turn LED on or off
        }
    });
});

function responsePinList() {
    var result = [];
    pins.forEach(function(pin) {
        result.push((<any>Object).assign({}, pin, {
            enabled: leds[pin.pin].readSync()
        }));
    });
    return result;
}
// console.log(app);

console.log(process.env.PORT);
console.log(process.env.GPIO_DRIVER);
// process.exit();

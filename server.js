var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

server.listen(8080);

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

app.use('/', express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    socket.emit('pin/list', responsePinList());
    socket.on('pin/enable', function(data) { //get light switch status from client
        var pin = data.pin;
        var enabled = data.enabled;
        if (leds[pin] && enabled != ledReadSync(leds[pin])) { //only change LED if status has changed
            ledWriteSync(leds[pin], enabled); //turn LED on or off
        }
    });
});

function responsePinList() {
    var result = [];
    pins.forEach(function(pin) {
        result.push(Object.assign({}, pin, {
            enabled: ledReadSync(leds[pin.pin])
        }));
    });
    return result;
}

function initLEDs(pins) {
    var leds = {};
    pins.forEach(function(pin) {
        var led = new Gpio(pin.pin, 'out');
        ledWriteSync(led, pin.enabled);
        leds[pin.pin] = led;
    });
    return leds;
}

function ledWriteSync(led, enabled) {
    led.writeSync(Number(!enabled));
}

function ledReadSync(led) {
    return led.readSync() == 0 ? true : false;
}

process.on('SIGINT', function () { //on ctrl+c
    pins.forEach(function (pin) {
        var led = leds[pin.pin];
        ledWriteSync(led, false);
        led.unexport();
    })
    process.exit(); //exit completely
});

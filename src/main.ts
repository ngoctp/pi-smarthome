import * as dotenv from 'dotenv';
(dotenv as any).config();

import * as express from 'express';
const app = express();
import { Server } from 'http';
const server = new Server(app);
import * as socketIO from 'socket.io';

import Pin from './models/pin';
import PinManager from './pin/pin-manager';

Pin.getInstance().getList().then((pins) => {
    PinManager.getInstance().setPins(pins);

}).then(() => {
    const io = socketIO(server);
    io.on('connection', (socket) => {
        socket.emit('pin/list', (() => {
            const result = [];
            PinManager.getInstance().getPins().forEach((pin) => {
                result.push((Object as any).assign({}, pin, {
                    enabled: PinManager.getInstance().getLedManager().getLed(pin.pin).led.readSync(),
                }));
            });
            return result;
        })());
        socket.on('pin/switch', (data) => { // get light switch status from client
            const pin = data.pin;
            const enabled = data.enabled;
            const led = PinManager.getInstance().getLedManager().getLed(pin);
            if (led) {
                led.led.switch(enabled);
            }
        });
    });

}).then(() => {
    app.use('/', (express as any).static(__dirname + '/../public'));
    server.listen({
        host: process.env.HOST,
        port: process.env.PORT
    });

});

process.on('SIGINT', () => { // on ctrl+c
    PinManager.getInstance().getLedManager().unexport();
    process.exit(); // exit completely

});

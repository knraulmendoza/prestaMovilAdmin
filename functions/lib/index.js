"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
exports.barrio = functions.firestore.document('barrio/{id}').onWrite(evt => {
    const _token = 'c8HgZtUfgEo:APA91bHXces2cUb8NF_j8PCda8A1VbTC52A2imhWPxxudGxKYT_6YIABEPWjHCZNJNh8GjAjJwmyyenTP9sJtqG9tnk0KRUH0JVYtBoEQa7luDgVr-Dl8dhhxVbfTCnrKeJvpatH7MwNCXo1HRNHju0ds772HZLNQg';
    const payload = {
        notification: {
            title: 'PrestaYA',
            body: 'Se ha registrado un nuevo cliente/prestamo',
            badge: '1',
            sound: 'default'
        }
    };
    return admin.messaging().sendToDevice(_token, payload);
    // return admin.messaging().send(payload);
});
exports.createCliente = functions.firestore.document('cliente/{id}').onCreate((evt) => __awaiter(this, void 0, void 0, function* () {
    const cliente = evt.data();
    const idCobro = cliente.cobro;
    const cobroRef = db.collection('cobro').where('idCobro', '==', idCobro);
    const cobro = yield cobroRef.get();
    let nameCobro = '';
    cobro.forEach(cob => {
        const name = cob.data().name;
        nameCobro = name;
    });
    const payload = {
        notification: {
            title: `cobro ${nameCobro}`,
            body: 'Ha registrado un nuevo cliente',
            badge: '1',
            sound: 'default'
        }
    };
    const devicesRef = db.collection('devices');
    // get the user's tokens and send notifications
    const devices = yield devicesRef.get();
    const tokens = [];
    // send a notification to each device token
    devices.forEach(result => {
        const token = result.data().token;
        tokens.push(token);
    });
    return admin.messaging().sendToDevice(tokens, payload);
}));
exports.updateCliente = functions.firestore.document('cliente/{id}').onUpdate((evt) => __awaiter(this, void 0, void 0, function* () {
    const cliente = evt.after.data();
    const idCobro = cliente.cobro;
    const cobroRef = db.collection('cobro').where('idCobro', '==', idCobro);
    const cobro = yield cobroRef.get();
    let nameCobro = '';
    cobro.forEach(cob => {
        const name = cob.data().name;
        nameCobro = name;
    });
    const payload = {
        notification: {
            title: `cobro ${nameCobro}`,
            body: 'Ha registrado un nuevo Prestamo',
            badge: '1',
            sound: 'default'
        }
    };
    const devicesRef = db.collection('devices');
    // get the user's tokens and send notifications
    const devices = yield devicesRef.get();
    const tokens = [];
    // send a notification to each device token
    devices.forEach(result => {
        const token = result.data().token;
        tokens.push(token);
    });
    return admin.messaging().sendToDevice(tokens, payload);
}));
//# sourceMappingURL=index.js.map
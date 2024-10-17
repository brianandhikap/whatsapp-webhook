const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    }
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('Authenticated');
});

client.on('ready', () => {
    console.log('Client is ready!');
});

//app.post('/send-message', (req, res) => {
//    const { number, message } = req.body;

//    client.sendMessage(`${number}@c.us`, message).then(response => {
//        res.status(200).json({ success: true, response });
//    }).catch(err => {
//        res.status(500).json({ success: false, error: err });
//    });
//});

client.on('message', async (message) => {
    const from = message.from.includes('@c.us') ? message.from.split('@')[0] : message.from;

    if (message.type === 'chat') {
        console.log(`Chat from ${from}: ${message.body}`);
    } else if (message.type === 'status') {
        console.log(`Status from ${from}: ${message.body}`);
    }
});

client.initialize();

app.listen(2006, () => {
    console.log('Webhook listening on port 2006');
});
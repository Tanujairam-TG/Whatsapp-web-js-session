const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
  // Generate and display the QR code in the terminal
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
  // Your bot is now ready to send and receive messages!
});

client.on('authenticated', () => {
  console.log('Authenticated!');
  // The session is authenticated successfully
});

client.on('auth_failure', msg => {
  // Fired if session restore was unsuccessful
  console.error('Authentication failure', msg);
});

client.on('message', message => {
  console.log(message.body);
  // Echoes the same message back to the user
  message.reply(message.body);
});

client.initialize();

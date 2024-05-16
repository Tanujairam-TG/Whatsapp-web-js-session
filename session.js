const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const qrcode = require('qrcode-terminal');

// Initialize the client with LocalAuth strategy
const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', qr => {
  // Generate and display the QR code in the terminal
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
  // Send the session file to the saved messages
  const sessionFilePath = './.wwebjs_auth/session.json';
  const sessionData = fs.readFileSync(sessionFilePath, { encoding: 'utf-8' });
  const media = MessageMedia.fromFilePath(sessionFilePath);

  client.getChats().then(chats => {
    const savedMessages = chats.find(chat => chat.isSelf);
    if (savedMessages) {
      savedMessages.sendMessage(media).then(() => {
        console.log('Session file sent to saved messages.');
      });
    }
  });
});

client.on('authenticated', () => {
  console.log('Authenticated!');
});

// Start the client
client.initialize();

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const puppeteer = require('puppeteer');

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

// Function to check if the session file exists
function checkForSessionFile() {
  if (fs.existsSync(SESSION_FILE_PATH)) {
    console.log('**Session file found.**');
    return true;
  } else {
    console.log('**Session file not found.** A new session will be created.');
    return false;
  }
}

// Initialize the client with LocalAuth strategy and Puppeteer configuration
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './.wwebjs_auth' // Specify the path to store the session data
  }),
  puppeteer: {
    headless: true, // Run Puppeteer in headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Additional arguments for Puppeteer
  }
});

client.on('qr', (qr) => {
  // Generate and display the QR code in the terminal
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('**Client is ready!**');
  // Check for the session file when the client is ready
  checkForSessionFile();
});

client.on('authenticated', (session) => {
  console.log('**Authenticated!**');
  // Save session values to the file upon successful auth
  fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
});

client.on('auth_failure', msg => {
  console.error('**Authentication failure:**', msg);
});

client.on('message', message => {
  message.reply(message.body);
});

// Check for the session file before initializing the client
checkForSessionFile();
client.initialize();

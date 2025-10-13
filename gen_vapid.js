// Generates VAPID keys and prints them to console — save them into .env
const webpush = require('web-push');
const keys = webpush.generateVAPIDKeys();
console.log('VAPID_PUBLIC_KEY=' + keys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + keys.privateKey);
console.log('\nCopy these into a .env file as VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY.');

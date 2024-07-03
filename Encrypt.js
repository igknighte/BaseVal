const crypto = require('crypto');

// Generate a random 256-bit (32 bytes) key
const key = crypto.randomBytes(32);

// Generate a random 128-bit (16 bytes) initialization vector
const iv = crypto.randomBytes(16);

// Function to encrypt text
function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Function to decrypt text
function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Example usage
const textToEncrypt = "Hello, this is a secret message!";
const encryptedText = encrypt(textToEncrypt);
const decryptedText = decrypt(encryptedText);

console.log("Original Text: ", textToEncrypt);
console.log("Encrypted Text: ", encryptedText);
console.log("Decrypted Text: ", decryptedText);

import CryptoJS from 'crypto-js';

// Retrieve the key and IV from environment variables
const key = CryptoJS.enc.Base64.parse(import.meta.env.VITE_ENCRYPTION_KEY);
const iv = CryptoJS.enc.Base64.parse(import.meta.env.VITE_IV);

// Function to encrypt text
export function encrypt(text) {
  const encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv }).toString();
  return encrypted;
}

// Function to decrypt text
export function decrypt(encryptedText) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, key, { iv: iv });
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
}

// Example usage
const textToEncrypt = "Hello, this is a secret message!";
const encryptedText = encrypt(textToEncrypt);
const decryptedText = decrypt(encryptedText);

console.log("Original Text: ", textToEncrypt);
console.log("Encrypted Text: ", encryptedText);
console.log("Decrypted Text: ", decryptedText);

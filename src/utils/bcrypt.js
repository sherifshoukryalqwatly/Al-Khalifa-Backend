import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
 import fs from 'fs'

 const publicKey = fs.readFileSync('publicKey.pem',"utf8");
 const privateKey = fs.readFileSync('privateKey.pem',"utf8");
 console.log("✅ Keys generated!");

 function encryptRSA(text) {
    console.log("publicKey:", publicKey);
    console.log("privateKey:", privateKey);
    console.log("Text to encrypt:", text);
  return crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(text)
  ).toString("base64");
}

// Decrypt
function decryptRSA(encryptedBase64) {
    console.log("publicKey:", publicKey);
    console.log("privateKey:", privateKey);
    console.log("Text to decrypt:", encryptedBase64);
  return crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encryptedBase64, "base64")
  ).toString("utf8");
}

export { encryptRSA, decryptRSA };
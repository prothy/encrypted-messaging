import CryptoJS from "crypto-js";
import aes from "crypto-js/aes";
import hmac from "crypto-js/hmac-sha1";

export const debounce = (
  callback: (...args: any[]) => any,
  timeout: number
) => {
  let timeoutId: number;

  return (...args: any[]) =>
    new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const value = callback(...args);
        resolve(value);
      }, timeout);
    });
};

// const key = crypto.randomUUID();

// console.log(key);

const secretKey = CryptoJS.SHA256('secret key')

export const encryptMessage = (message: string, key: string) => {
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = aes.encrypt(message, secretKey, {
    iv,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding,
  });

  const encryptedString = CryptoJS.enc.Base64.stringify(
    iv.concat(encrypted.ciphertext)
  );

  return encryptedString;
};

export const decryptMessage = (encrypted: string, hash: string) => {
  const cipher = CryptoJS.enc.Base64.parse(encrypted);

  const iv = CryptoJS.lib.WordArray.create(cipher.words.slice(0, 4));
  const ciphertext = CryptoJS.lib.WordArray.create(cipher.words.slice(4));

  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext,
  });

  const decrypted = aes.decrypt(cipherParams, secretKey, {
    iv,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding,
  });

  const text = decrypted.toString(CryptoJS.enc.Utf8);

  return text;
};

export const generateHash = (message: string, key: string) =>
  hmac(message, key).toString();

export const isHashValid = (message: string, hash: string, key: string) =>
  hash === hmac(message, key).toString();

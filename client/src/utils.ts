import CryptoJS, { AES, HmacSHA1, SHA256 } from "crypto-js";
import { postMessage } from "./api";

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

export const generateKey = () => {
  const currentKey = sessionStorage.getItem("key");

  if (currentKey) {
    return currentKey;
  }

  const key = crypto.randomUUID();
  sessionStorage.setItem("key", key);

  return key;
};

export const getKeyFromUrl = () => {
  const { searchParams } = new URL(location.href);

  return searchParams.get("key");
};

export const debouncedPostMessage = debounce(async (ev, key) => {
  postMessage(ev.target.value, key);
}, 1000);

export const encryptMessage = (message: string, key: string) => {
  const iv = CryptoJS.lib.WordArray.random(16);

  console.log(key);

  const encrypted = AES.encrypt(message, SHA256(key), {
    iv,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding,
  });

  const encryptedString = CryptoJS.enc.Base64.stringify(
    iv.concat(encrypted.ciphertext)
  );

  return encryptedString;
};

export const decryptMessage = (encrypted: string, key: string) => {
  const cipher = CryptoJS.enc.Base64.parse(encrypted);

  const iv = CryptoJS.lib.WordArray.create(cipher.words.slice(0, 4));
  const ciphertext = CryptoJS.lib.WordArray.create(cipher.words.slice(4));

  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext,
  });

  const decrypted = AES.decrypt(cipherParams, SHA256(key), {
    iv,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const generateHash = (message: string, key: string) => {
  const parsedKey = CryptoJS.enc.Utf8.parse(key);
  const hmac = HmacSHA1(message, parsedKey);

  return hmac.toString(CryptoJS.enc.Hex);
};

export const isHashValid = (message: string, key: string, hash: string) =>
  hash === generateHash(message, key);

import {
  generateHash,
  encryptMessage,
  isHashValid,
  decryptMessage,
} from "./utils";

const SERVER_URL = "http://localhost:3000/";
const SIGNATURE_HEADER = "X-Signature";

export const postMessage = async (message: string, key: string) => {
  fetch(SERVER_URL, {
    headers: {
      [SIGNATURE_HEADER]: generateHash(message, key),
    },
    method: "post",
    body: encryptMessage(message, key),
  });
};

export const getMessage = async (key: string) => {
  const response = await fetch(SERVER_URL);
  const body = await response.text();

  const message = decryptMessage(body, key);
  const signature = response.headers.get(SIGNATURE_HEADER) ?? '';
  const valid = isHashValid(message, key, signature);

  return { message, valid };
};

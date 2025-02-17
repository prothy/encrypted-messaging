import { generateHash, encryptMessage, isHashValid, decryptMessage } from "./utils";

const SERVER_URL = "http://localhost:3000/";
const SIGNATURE_HEADER = 'X-Signature'

const key = 'e0f50aa3-f3ec-47e5-a528-1e25c3d75920' // crypto.randomUUID()

export const postMessage = async (message: string) => {
    console.log(key),

  fetch(SERVER_URL, {
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
      [SIGNATURE_HEADER]: generateHash(message, key),
    },
    method: "post",
    body: encryptMessage(message, key),
  });
};

export const getMessage = async (key: string) => {
  const response = await fetch(SERVER_URL);
  const body = await response.text()

  const message = decryptMessage(body, key)
  const signature = response.headers.get(SIGNATURE_HEADER);

  console.log(message)

  const valid = isHashValid(message, signature ?? '', key)

  return { message, valid };
};

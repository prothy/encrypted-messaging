import CryptoJS from 'crypto-js'
import aes from 'crypto-js/aes'
import hmac from 'crypto-js/hmac-sha1'

const SERVER_URL = 'http://localhost:3000/'

const key = crypto.randomUUID()

export const encryptMessage = (message: string) =>
    aes.encrypt(message, key, {
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.NoPadding
    }).toString()

export const generateHmac = (message: string) => hmac(message, key).toString()

export const postMessage = async (message: string) => {
    fetch(SERVER_URL, {
        headers: {
            'Content-Type': 'text/plain; charset=UTF-8',
            'X-Signature': generateHmac(message)
        },
        method: 'post',
        body: encryptMessage(message)
    })
}

export const getMessage = async () => {
    const response = await fetch(SERVER_URL);

    return response.body;
}
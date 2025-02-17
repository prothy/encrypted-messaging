# encrypted-messaging

Encrypted messaging app with one way messaging and symmetric encryption.

## Running the project

Requirements are Node (I used v20.14) and npm. To run the project, simply run `npm run init` in the topmost folder, this will set up everything and launch both the client and server. You can access the client app at `localhost:5173`, the server uses `localhost:3000`.

The sender 

For transparency, I have left notes as I completed the task, divided into my initial approach, changes during development, then some final thoughts.

## Before starting

Here was my plan, before starting. I did not follow it exactly, as there were some challenges I faced.

### Tools

For simplicity's sake, the minimum amount of tools are used:

**Client**

- React
- Tailwind for basic styling

**Server**

- Express
  - v5 supports modern syntax, which makes this the most straightforward choice

**Some considerations**
- I thought about using WebSocket for this task, but it is not a requirement to send multiple messages. Therefore HTTP requests are sufficient
- Both the browser and Node.js have crypto modules, so no libraries are needed

### Plan

**Sender**

- When the user loads the home route `/`, they are shown an input and the URL to share with the receiver
- Sender generates a key and stores it in memory. I considered using `sessionStorage` to maintain persistence between refreshes, but the key would technically be vulnerable to XSS. Since persistence is not a requirement anyway, this approach should be sufficient
- Input field sends debounced `POST` requests `onChange`, the body containing the encrypted message
  - The client will attach an HMAC key in an HTTP header, generated from the message and encryption key

**Receiver**
- When the user loads the home route, with the key attached as a query parameter (`?key=`), they are shown just a message (or not, if the key doesn't match)
  - I briefly considered using React Router and get the key from a dynamic route, but the current approach is slightly simpler
- The receiver sends a `GET` request and decrypts the message
  - The validity is verified by generating a new HMAC key based on the encryption key and message and comparing it with the one received in the header

**Server**
- It stores the encrypted message and the HMAC key in memory
- The server hosts a `GET` and a `POST` route, respectively

## Changes during development

### Tools

- I have thought about using the native Crypto module but it does not support AES256 in CFB mode. Therefore I switched to using CryptoJS.
- I decided to leave out styling to save time, therefore not needing Tailwind.

### Challenges

- I ran into an issue where using the key directly would not result in a successful encryption, and the decrypted value is empty. I was able to fix this by using SHA256 to hash the key to a fixed size of 256 bits.
- It took some time to research how to pass the IV to be able to later decrypt the content, I found out it is acceptable to attach before the encrypted message if the IV is random.

## After finishing

- I would have liked to add a long polling endpoint so that the message is updated automatically. This would have been separate from the initial GET request, the way it would work is that the connection only closes once the message is updated, before the client opens a new request again.
- End to end testing would have been implemented with Playwright.
- There are some bugs that I have not investigated: 
  - Sometimes, when sending a new message, the receiver will receive some extra character, which breaks the signature verification. I think something is going wrong when encoding the cipher text to plain text, so I would start debuggin by comparing the cipher texts in the `encryptMessage` and `decryptMessage` functions.
  - Sometimes, the receiver fails to decrypt the content entirely and encoding fails. Something similar is probably going wrong as above.
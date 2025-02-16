# encrypted-messaging

Encrypted messaging app with one way messaging and symmetric encryption.

## Tools

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

## Approach

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
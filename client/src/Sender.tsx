import { useState } from "react";
import { debounce } from "./utils";
import { postMessage } from "./api";

const statusTexts = {
  init: "Please enter your message",
  sent: "Message has been updated",
};

const generateKey = () => {
  const currentKey = sessionStorage.getItem("key");

  if (currentKey) {
    return currentKey;
  }

  const key = crypto.randomUUID();
  sessionStorage.setItem("key", key);

  return key;
};

const key = generateKey();

const receiverUrl = `http://localhost:5173/?key=${key}`;

const debouncedPostMessage = debounce(async (ev) => {
  postMessage(ev.target.value, key);
}, 1000);

export const Sender = () => {
  const [status, setStatus] = useState<keyof typeof statusTexts>("init");
  return (
    <main>
      <div>{statusTexts[status]}</div>
      <textarea
        placeholder="Enter a message"
        onChange={async (ev) => {
          setStatus("init");

          await debouncedPostMessage(ev);
          setStatus("sent");
        }}
      ></textarea>
      <div>
        <a href={receiverUrl}>
          <code>{receiverUrl}</code>
        </a>
      </div>
    </main>
  );
};

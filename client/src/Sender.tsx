import { useState } from "react";
import { debouncedPostMessage, generateKey } from "./utils";

const statusTexts = {
  init: "Please enter your message",
  sent: "Message has been updated",
};

const key = generateKey();

const receiverUrl = `https://${location.host}/?key=${key}`;

export const Sender = () => {
  const [status, setStatus] = useState<keyof typeof statusTexts>("init");

  return (
    <main>
      <div>{statusTexts[status]}</div>
      <textarea
        placeholder="Enter a message"
        onChange={async (ev) => {
          setStatus("init");

          await debouncedPostMessage(ev, key);
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

import { useEffect, useLayoutEffect, useState } from "react";
import "./App.css";
import { debounce } from "./utils";
import { getMessage, postMessage } from "./api";

const statusTexts = {
  init: "Please enter your message",
  sent: "Message has been updated",
};

const debouncedPostMessage = debounce(async (ev) => {
  postMessage(ev.target.value);
}, 1000);

const getKeyFromUrl = () => {
  const { searchParams } = new URL(location.href);

  return searchParams.get("key");
};

const key = getKeyFromUrl();

function App() {
  const [isKeySet, setIsKeySet] = useState(false);
  const [status, setStatus] = useState<keyof typeof statusTexts>("init");

  const [message, setMessage] = useState("Loading...");

  useLayoutEffect(() => {
    setIsKeySet(!!key);
  }, []);

  useEffect(() => {
    const handleMessageContent = async () => {
      if (key) {
        const { message, valid } = await getMessage(key);

        setMessage(`${valid}: ${message}`);
      }
    };

    handleMessageContent();
  }, []);

  return (
    <>
      {isKeySet ? (
        <main>{message}</main>
      ) : (
        <main>
          {statusTexts[status]}
          <textarea
            placeholder="Enter a message"
            onChange={async (ev) => {
              setStatus("init");

              await debouncedPostMessage(ev);
              setStatus("sent");
            }}
          ></textarea>
        </main>
      )}
    </>
  );
}

export default App;

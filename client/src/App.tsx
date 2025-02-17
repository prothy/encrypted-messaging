import { useLayoutEffect, useState } from "react";
import "./App.css";
import { debounce } from "./utils";
import { postMessage } from "./api";

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

function App() {
  const [isKeySet, setIsKeySet] = useState(false);
  const [status, setStatus] = useState<keyof typeof statusTexts>("init");

  useLayoutEffect(() => {
    setIsKeySet(!!getKeyFromUrl());
  }, []);

  return (
    <>
      {isKeySet ? (
        <main>Key is set</main>
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

import { useEffect, useState } from "react";
import { getMessage } from "./api";
import { getKeyFromUrl } from "./utils";

const key = getKeyFromUrl();
const getValidityMessage = (valid: boolean) =>
  valid ? "Signature is valid" : "Signature is invalid";

export const Receiver = () => {
  const [valid, setValid] = useState(false);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const handleMessageContent = async () => {
      if (key) {
        const { message, valid } = await getMessage(key);

        setMessage(message);
        setValid(valid);
      }
    };

    handleMessageContent();
  }, []);

  return (
    <main>
      <div
        style={{
          color: valid ? "green" : "red",
        }}
      >
        {getValidityMessage(valid)}
      </div>
      <div>{message}</div>
    </main>
  );
};

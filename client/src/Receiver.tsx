import { useEffect, useState } from "react";
import { getMessage } from "./api";
import { getKeyFromUrl } from "./utils";

const key = getKeyFromUrl();

export const Receiver = () => {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const handleMessageContent = async () => {
      if (key) {
        const { message, valid } = await getMessage(key);

        setMessage(`${valid}: ${message}`);
      }
    };

    handleMessageContent();
  }, []);

  return <main>{message}</main>;
};

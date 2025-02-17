import { useLayoutEffect, useState } from "react";
import "./App.css";
import { getKeyFromUrl } from "./utils";
import { Sender } from "./Sender";
import { Receiver } from "./Receiver";

const key = getKeyFromUrl();

function App() {
  const [isKeySet, setIsKeySet] = useState(false);

  useLayoutEffect(() => {
    setIsKeySet(!!key);
  }, []);

  return <>{isKeySet ? <Receiver /> : <Sender />}</>;
}

export default App;

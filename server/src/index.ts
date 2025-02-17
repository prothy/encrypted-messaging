import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const message = {
  hmac: "",
  content: "",
};

app.use(bodyParser.text());
app.use(cors());
app.use("/", (req, _, next) => {
  console.log(req.method, req.body);
  next();
});

app.get("/", (_, res) => {
    console.log(message.content)
  res.set({ "content-type": "text/plain; charset=utf-8" });
  res.set("X-Signature", message.hmac);
  res.send(message.content);
});

app.post("/", (req, res) => {
  message.content = req.body;
  message.hmac = req.get("X-Signature") ?? "";
  res.send("Sent message!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

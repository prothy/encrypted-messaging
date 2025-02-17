import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const message = {
  signature: "",
  content: "",
};

app.use(bodyParser.text());
app.use(cors());

app.get("/", (_, res) => {
  res
    .set({
      "Access-Control-Expose-Headers": "X-Signature",
      "X-Signature": message.signature,
    })
    .send(message.content);
});

app.post("/", (req, res) => {
  message.content = req.body;
  message.signature = req.get("X-Signature") ?? "";
  res.send("Sent message!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

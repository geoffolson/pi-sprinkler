import express from "express";
import { config } from "./loadConfig";

const app = express();
const port = config.port;

app.use(async (req, res, next) => {
  try {
    next();
  } catch (e) {
    console.log(`${new Date()}: ${JSON.stringify(e)}`);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/zone", async () => {});

app.post("/schedule", async () => {});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

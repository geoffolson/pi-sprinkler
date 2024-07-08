import express, { Request, Response, NextFunction } from "express";
import { config } from "./loadConfig";
import { PrismaClient } from "@prisma/client";
import { IrrigationPin } from "common";

const prisma = new PrismaClient();

const app = express();
const port = config.port;

// Async wrapper function
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post(
  "/irrigation-pin",
  asyncHandler(async (req: Request, res: Response) => {
    const data = IrrigationPin.parse(req.body);
    await prisma.irrigationPin.upsert({
      create: data,
      update: data,
      where: {
        channel: data.channel,
      },
    });
    res.send();
  })
);

app.post("/zone", async () => {});

app.post("/schedule", async () => {});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

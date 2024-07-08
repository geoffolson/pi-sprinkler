import express, { Request, Response, NextFunction } from "express";
import { config } from "./loadConfig";
import { PrismaClient } from "@prisma/client";
import { IrrigationPin, IrrigationSchedule, IrrigationZone } from "common";
import { z } from "zod";
import type { IrrigationZoneDuration } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
const port = config.port;

// Async wrapper function
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

app.use(express.json());

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

app.post(
  "/irrigation-zone",
  asyncHandler(async (req: Request, res: Response) => {
    const data = IrrigationZone.parse(req.body);
    await prisma.irrigationZone.upsert({
      create: {
        name: data.name,
        irrigationPinChannel: data.channel,
        precipitationRate: data.precipitationRate,
      },
      update: {
        name: data.name,
        irrigationPinChannel: data.channel,
        precipitationRate: data.precipitationRate,
      },
      where: {
        irrigationPinChannel: data.channel,
      },
    });
  })
);

const IdSchema = z.object({ id: z.coerce.number() });
app.get(
  "/schedule",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = IdSchema.parse(req.query);
    const schedule = await prisma.schedule.findFirst({
      where: { id },
      include: { channels: true },
    });
    res.send(schedule);
  })
);
app.get(
  "/schedules",
  asyncHandler(async (req: Request, res: Response) => {
    const schedule = await prisma.schedule.findMany({
      include: { channels: true },
    });
    res.send(schedule);
  })
);
app.post(
  "/schedule",
  asyncHandler(async (req: Request, res: Response) => {
    const data = IrrigationSchedule.parse(req.body);
    const schedule = await prisma.schedule.create({
      data: {
        cron: data.cron,
        channels: {
          createMany: {
            data: data.channels.map(
              (zone): Omit<IrrigationZoneDuration, "id" | "scheduleId"> => {
                return {
                  type: zone.type,
                  durationOrInches: zone.durationOrInches,
                  irrigationZoneIrrigationPinChannel: zone.channel,
                };
              }
            ),
          },
        },
      },
      include: {
        channels: true,
      },
    });
    res.send(schedule);
  })
);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

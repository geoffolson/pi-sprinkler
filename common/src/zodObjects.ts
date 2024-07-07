import { z } from "zod";

export const IrrigationZone = z.object({
  channel: z.number(),
  name: z.string(),
  precipitationRate: z.number().optional().default(2),
});

export const ToggleIrrigationZone = z.number();

// add option to use precipitation instead of length of time
export const IrrigationZoneDuration = z.object({
  channel: z.number(),
  length: z.number(),
});

export const IrrigationSchedule = z.object({
  schedule: z.number(),
  channels: z.array(IrrigationZoneDuration),
});

export const IrrigationPin = z.object({
  channel: z.number(),
  gpioPin: z.number(),
});

import { readFileSync } from "fs";
import path from "path";
import { z } from "zod";

const fileStr = readFileSync(path.resolve(__dirname, "../../config.json"), {
  encoding: "utf-8",
});

const schema = z
  .object({
    port: z.number(),
  })

export const config = schema.parse(JSON.parse(fileStr));
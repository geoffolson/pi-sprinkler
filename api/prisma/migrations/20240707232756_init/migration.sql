-- CreateTable
CREATE TABLE "Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cron" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "IrrigationZoneDuration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "durationOrInches" REAL NOT NULL,
    "scheduleId" INTEGER,
    "irrigationZoneIrrigationPinChannel" INTEGER NOT NULL,
    CONSTRAINT "IrrigationZoneDuration_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "IrrigationZoneDuration_irrigationZoneIrrigationPinChannel_fkey" FOREIGN KEY ("irrigationZoneIrrigationPinChannel") REFERENCES "IrrigationZone" ("irrigationPinChannel") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IrrigationPin" (
    "channel" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gpioPin" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "IrrigationZone" (
    "precipitationRate" REAL NOT NULL DEFAULT 2,
    "name" TEXT NOT NULL,
    "irrigationPinChannel" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    CONSTRAINT "IrrigationZone_irrigationPinChannel_fkey" FOREIGN KEY ("irrigationPinChannel") REFERENCES "IrrigationPin" ("channel") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_cron_key" ON "Schedule"("cron");

-- CreateIndex
CREATE UNIQUE INDEX "IrrigationPin_gpioPin_key" ON "IrrigationPin"("gpioPin");

-- CreateIndex
CREATE UNIQUE INDEX "IrrigationZone_name_key" ON "IrrigationZone"("name");

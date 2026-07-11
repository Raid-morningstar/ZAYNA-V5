ALTER TABLE "Order"
ADD COLUMN "statusChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "Order"
SET "statusChangedAt" = "updatedAt";

CREATE INDEX "Order_statusChangedAt_idx" ON "Order"("statusChangedAt");

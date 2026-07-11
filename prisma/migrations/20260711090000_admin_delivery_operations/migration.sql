CREATE TYPE "DeliveryStatus" AS ENUM (
  'not_assigned',
  'preparing',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'delayed',
  'failed',
  'returned'
);

ALTER TABLE "Product"
ADD COLUMN "lastRestockedAt" TIMESTAMP(3);

ALTER TABLE "Order"
ADD COLUMN "deliveryCompany" TEXT,
ADD COLUMN "deliveryPersonName" TEXT,
ADD COLUMN "driverPhoneNumber" TEXT,
ADD COLUMN "trackingNumber" TEXT,
ADD COLUMN "deliveryStatus" "DeliveryStatus" NOT NULL DEFAULT 'not_assigned';

CREATE INDEX "Order_deliveryStatus_orderDate_idx" ON "Order"("deliveryStatus", "orderDate");

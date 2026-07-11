CREATE OR REPLACE FUNCTION set_order_status_changed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF
    NEW."status" IS DISTINCT FROM OLD."status"
    OR NEW."paymentStatus" IS DISTINCT FROM OLD."paymentStatus"
    OR NEW."deliveryStatus" IS DISTINCT FROM OLD."deliveryStatus"
  THEN
    NEW."statusChangedAt" = CURRENT_TIMESTAMP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "Order_statusChangedAt_trigger" ON "Order";

CREATE TRIGGER "Order_statusChangedAt_trigger"
BEFORE UPDATE ON "Order"
FOR EACH ROW
EXECUTE FUNCTION set_order_status_changed_at();

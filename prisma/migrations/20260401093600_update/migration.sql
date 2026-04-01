-- DropIndex
DROP INDEX "arms_class_master_id_key";

-- CreateIndex
CREATE INDEX "arms_class_master_id_idx" ON "arms"("class_master_id");

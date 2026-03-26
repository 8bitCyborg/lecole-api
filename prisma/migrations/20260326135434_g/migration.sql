-- DropIndex
DROP INDEX "User_phone_key";

-- DropIndex
DROP INDEX "User_role_key";

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

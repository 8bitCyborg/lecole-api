/*
  Warnings:

  - You are about to drop the column `user_id` on the `schools` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cac_number]` on the table `schools` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[moe_number]` on the table `schools` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "schools" DROP CONSTRAINT "schools_user_id_fkey";

-- DropIndex
DROP INDEX "schools_email_key";

-- DropIndex
DROP INDEX "schools_user_id_key";

-- AlterTable
ALTER TABLE "schools" DROP COLUMN "user_id",
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "schoolId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "schools_cac_number_key" ON "schools"("cac_number");

-- CreateIndex
CREATE UNIQUE INDEX "schools_moe_number_key" ON "schools"("moe_number");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

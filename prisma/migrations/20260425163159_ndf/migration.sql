/*
  Warnings:

  - You are about to drop the column `profile_id` on the `memberships` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_id]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[staff_id]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "membership_staff_fkey";

-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "membership_student_fkey";

-- DropIndex
DROP INDEX "memberships_profile_id_key";

-- AlterTable
ALTER TABLE "memberships" DROP COLUMN "profile_id",
ADD COLUMN     "staff_id" TEXT,
ADD COLUMN     "student_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "memberships_student_id_key" ON "memberships"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_staff_id_key" ON "memberships"("staff_id");

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

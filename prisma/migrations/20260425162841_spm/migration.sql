/*
  Warnings:

  - You are about to drop the column `staff_id` on the `memberships` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `memberships` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profile_id]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_student_id_fkey";

-- DropIndex
DROP INDEX "memberships_staff_id_key";

-- DropIndex
DROP INDEX "memberships_student_id_key";

-- AlterTable
ALTER TABLE "memberships" DROP COLUMN "staff_id",
DROP COLUMN "student_id",
ADD COLUMN     "profile_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "memberships_profile_id_key" ON "memberships"("profile_id");

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "membership_student_fkey" FOREIGN KEY ("profile_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "membership_staff_fkey" FOREIGN KEY ("profile_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

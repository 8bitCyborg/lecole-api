/*
  Warnings:

  - You are about to drop the column `classId` on the `arms` table. All the data in the column will be lost.
  - You are about to drop the column `classMasterId` on the `arms` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `arms` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `current_session` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `current_term` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `grading_system` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `ownership_type` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `shortname` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `schools` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[class_master_id]` on the table `arms` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,school_id]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `schools` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[short_name]` on the table `schools` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `class_id` to the `arms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `arms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `schools` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "arms" DROP CONSTRAINT "arms_classId_fkey";

-- DropForeignKey
ALTER TABLE "arms" DROP CONSTRAINT "arms_classMasterId_fkey";

-- DropForeignKey
ALTER TABLE "arms" DROP CONSTRAINT "arms_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "schools" DROP CONSTRAINT "schools_userId_fkey";

-- DropIndex
DROP INDEX "arms_classId_idx";

-- DropIndex
DROP INDEX "arms_classMasterId_key";

-- DropIndex
DROP INDEX "arms_schoolId_idx";

-- DropIndex
DROP INDEX "classes_name_schoolId_key";

-- DropIndex
DROP INDEX "classes_schoolId_idx";

-- DropIndex
DROP INDEX "schools_shortname_key";

-- DropIndex
DROP INDEX "schools_userId_key";

-- AlterTable
ALTER TABLE "arms" DROP COLUMN "classId",
DROP COLUMN "classMasterId",
DROP COLUMN "schoolId",
ADD COLUMN     "class_id" TEXT NOT NULL,
ADD COLUMN     "class_master_id" TEXT,
ADD COLUMN     "school_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "schoolId",
ADD COLUMN     "school_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "schools" DROP COLUMN "current_session",
DROP COLUMN "current_term",
DROP COLUMN "grading_system",
DROP COLUMN "ownership_type",
DROP COLUMN "shortname",
DROP COLUMN "userId",
ADD COLUMN     "currentSession" TEXT,
ADD COLUMN     "currentTerm" "Term",
ADD COLUMN     "gradingSystem" "GradingSystem",
ADD COLUMN     "ownershipType" "OwnershipType",
ADD COLUMN     "short_name" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "middle_name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "arms_class_master_id_key" ON "arms"("class_master_id");

-- CreateIndex
CREATE INDEX "arms_class_id_idx" ON "arms"("class_id");

-- CreateIndex
CREATE INDEX "arms_school_id_idx" ON "arms"("school_id");

-- CreateIndex
CREATE INDEX "classes_school_id_idx" ON "classes"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_school_id_key" ON "classes"("name", "school_id");

-- CreateIndex
CREATE UNIQUE INDEX "schools_user_id_key" ON "schools"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "schools_short_name_key" ON "schools"("short_name");

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arms" ADD CONSTRAINT "arms_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arms" ADD CONSTRAINT "arms_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arms" ADD CONSTRAINT "arms_class_master_id_fkey" FOREIGN KEY ("class_master_id") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[userId,school_id]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[school_id,admission_number]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Made the column `school_id` on table `students` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_school_id_fkey";

-- DropIndex
DROP INDEX "students_admission_number_key";

-- DropIndex
DROP INDEX "students_userId_key";

-- AlterTable
ALTER TABLE "students" ALTER COLUMN "school_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_school_id_key" ON "students"("userId", "school_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_school_id_admission_number_key" ON "students"("school_id", "admission_number");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

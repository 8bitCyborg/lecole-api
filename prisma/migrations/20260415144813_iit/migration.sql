/*
  Warnings:

  - You are about to drop the column `end_date` on the `academic_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `academic_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `session` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `term` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `session` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `term` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `session` on the `grading_modules` table. All the data in the column will be lost.
  - You are about to drop the column `term` on the `grading_modules` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_id,subject_id,grading_module_id,termId,sessionId]` on the table `grades` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termId` to the `attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `grades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termId` to the `grades` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'concluded', 'paused', 'abandoned');

-- DropIndex
DROP INDEX "grades_school_id_session_term_class_id_idx";

-- DropIndex
DROP INDEX "grades_student_id_subject_id_grading_module_id_term_session_key";

-- DropIndex
DROP INDEX "grading_modules_school_id_session_idx";

-- DropIndex
DROP INDEX "grading_modules_school_id_term_idx";

-- DropIndex
DROP INDEX "grading_modules_school_id_term_session_idx";

-- AlterTable
ALTER TABLE "academic_sessions" DROP COLUMN "end_date",
DROP COLUMN "start_date",
ADD COLUMN     "previous_session_id" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active',
ADD COLUMN     "terms_per_session" INTEGER NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "session",
DROP COLUMN "term",
ADD COLUMN     "sessionId" TEXT NOT NULL,
ADD COLUMN     "termId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "grades" DROP COLUMN "session",
DROP COLUMN "term",
ADD COLUMN     "sessionId" TEXT NOT NULL,
ADD COLUMN     "termId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "grading_modules" DROP COLUMN "session",
DROP COLUMN "term",
ADD COLUMN     "sessionId" TEXT,
ADD COLUMN     "termId" TEXT;

-- AlterTable
ALTER TABLE "terms" ADD COLUMN     "previous_term_id" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE INDEX "grades_school_id_sessionId_termId_class_id_idx" ON "grades"("school_id", "sessionId", "termId", "class_id");

-- CreateIndex
CREATE UNIQUE INDEX "grades_student_id_subject_id_grading_module_id_termId_sessi_key" ON "grades"("student_id", "subject_id", "grading_module_id", "termId", "sessionId");

-- CreateIndex
CREATE INDEX "grading_modules_school_id_termId_idx" ON "grading_modules"("school_id", "termId");

-- CreateIndex
CREATE INDEX "grading_modules_school_id_sessionId_idx" ON "grading_modules"("school_id", "sessionId");

-- CreateIndex
CREATE INDEX "grading_modules_school_id_termId_sessionId_idx" ON "grading_modules"("school_id", "termId", "sessionId");

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_termId_fkey" FOREIGN KEY ("termId") REFERENCES "terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "academic_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grading_modules" ADD CONSTRAINT "grading_modules_termId_fkey" FOREIGN KEY ("termId") REFERENCES "terms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grading_modules" ADD CONSTRAINT "grading_modules_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "academic_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_termId_fkey" FOREIGN KEY ("termId") REFERENCES "terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "academic_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_currentTermId_fkey" FOREIGN KEY ("currentTermId") REFERENCES "terms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_currentSessionId_fkey" FOREIGN KEY ("currentSessionId") REFERENCES "academic_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

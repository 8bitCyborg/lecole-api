/*
  Warnings:

  - You are about to drop the column `createdAt` on the `GradingModule` table. All the data in the column will be lost.
  - You are about to drop the column `isLocked` on the `GradingModule` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `GradingModule` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `GradingModule` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `GradingModule` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `GradingModule` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GradingModule_schoolId_session_idx";

-- DropIndex
DROP INDEX "GradingModule_schoolId_term_idx";

-- DropIndex
DROP INDEX "GradingModule_schoolId_term_session_idx";

-- AlterTable
ALTER TABLE "GradingModule" DROP COLUMN "createdAt",
DROP COLUMN "isLocked",
DROP COLUMN "schoolId",
DROP COLUMN "subjectId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_locked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "school_id" TEXT,
ADD COLUMN     "subject_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "grades" (
    "id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "student_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "grading_module_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "arm_id" TEXT,
    "term" TEXT NOT NULL,
    "session" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB DEFAULT '{}',

    CONSTRAINT "grades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "grades_school_id_session_term_class_id_idx" ON "grades"("school_id", "session", "term", "class_id");

-- CreateIndex
CREATE INDEX "grades_student_id_subject_id_idx" ON "grades"("student_id", "subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "grades_student_id_subject_id_grading_module_id_term_session_key" ON "grades"("student_id", "subject_id", "grading_module_id", "term", "session");

-- CreateIndex
CREATE INDEX "GradingModule_school_id_term_idx" ON "GradingModule"("school_id", "term");

-- CreateIndex
CREATE INDEX "GradingModule_school_id_session_idx" ON "GradingModule"("school_id", "session");

-- CreateIndex
CREATE INDEX "GradingModule_school_id_term_session_idx" ON "GradingModule"("school_id", "term", "session");

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_grading_module_id_fkey" FOREIGN KEY ("grading_module_id") REFERENCES "GradingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

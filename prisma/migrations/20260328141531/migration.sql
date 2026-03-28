/*
  Warnings:

  - You are about to drop the column `createdAt` on the `arms` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `arms` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `account_name` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `account_number` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `bank_name` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `currentSession` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `currentTerm` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `gradingSystem` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `moe_certicate_url` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `ownershipType` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `verificationStatus` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `admissionNumber` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `armId` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `guardianEmail` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `guardianPhone` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `isFeesPaid` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `staffId` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `teachers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[admission_number]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,school_id]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `teachers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[staff_id]` on the table `teachers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `arms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admission_number` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `teachers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `teachers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_armId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_classId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_userId_fkey";

-- DropIndex
DROP INDEX "schools_verificationStatus_idx";

-- DropIndex
DROP INDEX "students_admissionNumber_idx";

-- DropIndex
DROP INDEX "students_admissionNumber_key";

-- DropIndex
DROP INDEX "students_armId_idx";

-- DropIndex
DROP INDEX "students_classId_idx";

-- DropIndex
DROP INDEX "students_schoolId_idx";

-- DropIndex
DROP INDEX "subjects_name_schoolId_key";

-- DropIndex
DROP INDEX "subjects_schoolId_idx";

-- DropIndex
DROP INDEX "teachers_schoolId_idx";

-- DropIndex
DROP INDEX "teachers_staffId_key";

-- DropIndex
DROP INDEX "teachers_userId_key";

-- AlterTable
ALTER TABLE "arms" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "schools" DROP COLUMN "account_name",
DROP COLUMN "account_number",
DROP COLUMN "bank_name",
DROP COLUMN "createdAt",
DROP COLUMN "currentSession",
DROP COLUMN "currentTerm",
DROP COLUMN "gradingSystem",
DROP COLUMN "moe_certicate_url",
DROP COLUMN "ownershipType",
DROP COLUMN "updatedAt",
DROP COLUMN "verificationStatus",
ADD COLUMN     "accountName" TEXT,
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "current_session" TEXT,
ADD COLUMN     "current_term" "Term",
ADD COLUMN     "grading_system" "GradingSystem",
ADD COLUMN     "moe_certificate_url" TEXT,
ADD COLUMN     "ownership_type" "OwnershipType",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verification_status" "VerificationStatus" NOT NULL DEFAULT 'unverified';

-- AlterTable
ALTER TABLE "students" DROP COLUMN "admissionNumber",
DROP COLUMN "armId",
DROP COLUMN "classId",
DROP COLUMN "createdAt",
DROP COLUMN "dateOfBirth",
DROP COLUMN "guardianEmail",
DROP COLUMN "guardianPhone",
DROP COLUMN "isFeesPaid",
DROP COLUMN "schoolId",
DROP COLUMN "updatedAt",
ADD COLUMN     "admission_number" TEXT NOT NULL,
ADD COLUMN     "class_id" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "guardia_email" TEXT,
ADD COLUMN     "guardian_phone" TEXT,
ADD COLUMN     "is_fees_paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "school_id" TEXT,
ADD COLUMN     "string_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "createdAt",
DROP COLUMN "schoolId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "school_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "createdAt",
DROP COLUMN "schoolId",
DROP COLUMN "staffId",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "school_id" TEXT NOT NULL,
ADD COLUMN     "staff_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "schools_verification_status_idx" ON "schools"("verification_status");

-- CreateIndex
CREATE UNIQUE INDEX "students_admission_number_key" ON "students"("admission_number");

-- CreateIndex
CREATE INDEX "students_school_id_idx" ON "students"("school_id");

-- CreateIndex
CREATE INDEX "students_class_id_idx" ON "students"("class_id");

-- CreateIndex
CREATE INDEX "students_string_id_idx" ON "students"("string_id");

-- CreateIndex
CREATE INDEX "students_admission_number_idx" ON "students"("admission_number");

-- CreateIndex
CREATE INDEX "subjects_school_id_idx" ON "subjects"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_name_school_id_key" ON "subjects"("name", "school_id");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_user_id_key" ON "teachers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_staff_id_key" ON "teachers"("staff_id");

-- CreateIndex
CREATE INDEX "teachers_school_id_idx" ON "teachers"("school_id");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_string_id_fkey" FOREIGN KEY ("string_id") REFERENCES "arms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

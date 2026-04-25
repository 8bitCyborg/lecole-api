/*
  Warnings:

  - The `status` column on the `academic_sessions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `terms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('ADMIN', 'STAFF', 'STUDENT', 'GUARDIAN', 'TUTOR');

-- CreateEnum
CREATE TYPE "AcademicStatus" AS ENUM ('active', 'concluded', 'paused', 'abandoned', 'draft');

-- DropIndex
DROP INDEX "users_role_idx";

-- AlterTable
ALTER TABLE "academic_sessions" DROP COLUMN "status",
ADD COLUMN     "status" "AcademicStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "terms" DROP COLUMN "status",
ADD COLUMN     "status" "AcademicStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'STUDENT',
    "status" "MembershipStatus" NOT NULL DEFAULT 'PENDING',
    "profile_id" TEXT,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "memberships_profile_id_key" ON "memberships"("profile_id");

-- CreateIndex
CREATE INDEX "memberships_role_idx" ON "memberships"("role");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_user_id_school_id_key" ON "memberships"("user_id", "school_id");

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "membership_student_fkey" FOREIGN KEY ("profile_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "membership_staff_fkey" FOREIGN KEY ("profile_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `schoolId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_schoolId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "schoolId";

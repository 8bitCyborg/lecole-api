/*
  Warnings:

  - Added the required column `category` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('EARLY_YEARS', 'BASIC', 'JUNIOR_SECONDARY', 'SENIOR_SECONDARY', 'OTHER');

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "category" "Category" NOT NULL;

-- CreateIndex
CREATE INDEX "Class_category_idx" ON "Class"("category");

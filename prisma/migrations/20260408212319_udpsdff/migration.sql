/*
  Warnings:

  - You are about to drop the column `weight` on the `GradingModule` table. All the data in the column will be lost.
  - Added the required column `percentage` to the `GradingModule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GradingModule" DROP COLUMN "weight",
ADD COLUMN     "percentage" DOUBLE PRECISION NOT NULL;

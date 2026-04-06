/*
  Warnings:

  - The values [OTHER] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `guardia_email` on the `students` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('MALE', 'FEMALE');
ALTER TABLE "public"."staff" ALTER COLUMN "gender" DROP DEFAULT;
ALTER TABLE "staff" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TABLE "students" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "public"."Gender_old";
ALTER TABLE "staff" ALTER COLUMN "gender" SET DEFAULT 'MALE';
COMMIT;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "guardia_email",
ADD COLUMN     "guardian_email" TEXT;

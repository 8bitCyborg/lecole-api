-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'GUARDIAN';

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_userId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

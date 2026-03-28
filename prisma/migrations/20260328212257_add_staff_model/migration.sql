/*
  Warnings:

  - The values [TEACHER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `_SubjectToTeacher` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Title" AS ENUM ('MR', 'MRS', 'MS', 'DR', 'PASTOR', 'REVEREND', 'OTHER');

-- AlterEnum
ALTER TYPE "Gender" ADD VALUE 'OTHER';

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('STUDENT', 'STAFF', 'ADMIN');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
COMMIT;

-- DropForeignKey
ALTER TABLE "_SubjectToTeacher" DROP CONSTRAINT "_SubjectToTeacher_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectToTeacher" DROP CONSTRAINT "_SubjectToTeacher_B_fkey";

-- DropForeignKey
ALTER TABLE "arms" DROP CONSTRAINT "arms_class_master_id_fkey";

-- DropTable
DROP TABLE "_SubjectToTeacher";

-- CreateTable
CREATE TABLE "staff" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "bio" TEXT,
    "is_teaching_staff" BOOLEAN NOT NULL DEFAULT false,
    "staff_id" TEXT,
    "designation" TEXT NOT NULL DEFAULT 'Teacher',
    "gender" "Gender" NOT NULL DEFAULT 'MALE',
    "title" "Title",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StaffToSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StaffToSubject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_user_id_key" ON "staff"("user_id");

-- CreateIndex
CREATE INDEX "staff_school_id_idx" ON "staff"("school_id");

-- CreateIndex
CREATE INDEX "_StaffToSubject_B_index" ON "_StaffToSubject"("B");

-- AddForeignKey
ALTER TABLE "arms" ADD CONSTRAINT "arms_class_master_id_fkey" FOREIGN KEY ("class_master_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StaffToSubject" ADD CONSTRAINT "_StaffToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StaffToSubject" ADD CONSTRAINT "_StaffToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

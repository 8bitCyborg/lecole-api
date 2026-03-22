-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('unverified', 'pending', 'legally_verified', 'fully_accredited');

-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('nursery', 'primary', 'secondary', 'K12');

-- CreateEnum
CREATE TYPE "Curriculum" AS ENUM ('nigerian', 'british', 'montessori', 'other');

-- CreateEnum
CREATE TYPE "Term" AS ENUM ('first_term', 'second_term', 'third_term');

-- CreateEnum
CREATE TYPE "GradingSystem" AS ENUM ('percentage', 'waec', 'gpa', 'other');

-- CreateEnum
CREATE TYPE "OwnershipType" AS ENUM ('private', 'mission', 'public');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortname" TEXT,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "lga" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" "SchoolType" NOT NULL DEFAULT 'K12',
    "curriculum" "Curriculum" NOT NULL DEFAULT 'nigerian',
    "grading_system" "GradingSystem" NOT NULL DEFAULT 'waec',
    "current_term" "Term" NOT NULL DEFAULT 'first_term',
    "current_session" TEXT NOT NULL DEFAULT '2025/2026',
    "ownership_type" "OwnershipType",
    "proprietor" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "description" TEXT,
    "date_of_inception" TIMESTAMP(3),
    "cac_number" TEXT,
    "cac_certificate_url" TEXT,
    "moe_number" TEXT,
    "moe_certicate_url" TEXT,
    "trcn_url" TEXT,
    "tin" TEXT,
    "bank_name" TEXT,
    "account_number" TEXT,
    "account_name" TEXT,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "password" TEXT NOT NULL,
    "hashedRt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "School_user_id_key" ON "School"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "School_name_key" ON "School"("name");

-- CreateIndex
CREATE UNIQUE INDEX "School_shortname_key" ON "School"("shortname");

-- CreateIndex
CREATE UNIQUE INDEX "School_email_key" ON "School"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

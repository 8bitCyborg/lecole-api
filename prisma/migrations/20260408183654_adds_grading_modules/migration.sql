-- CreateEnum
CREATE TYPE "ModuleCategory" AS ENUM ('CA', 'EXAM', 'PRACTICAL');

-- CreateTable
CREATE TABLE "GradingModule" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT,
    "term" TEXT,
    "session" TEXT,
    "name" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "category" "ModuleCategory" NOT NULL DEFAULT 'CA',
    "sequence" INTEGER DEFAULT 0,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "subjectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradingModule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GradingModule_schoolId_term_idx" ON "GradingModule"("schoolId", "term");

-- CreateIndex
CREATE INDEX "GradingModule_schoolId_session_idx" ON "GradingModule"("schoolId", "session");

-- CreateIndex
CREATE INDEX "GradingModule_schoolId_term_session_idx" ON "GradingModule"("schoolId", "term", "session");

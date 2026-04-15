-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('EARLY_YEARS', 'BASIC', 'JUNIOR_SECONDARY', 'SENIOR_SECONDARY', 'OTHER');

-- CreateEnum
CREATE TYPE "ModuleCategory" AS ENUM ('CA', 'EXAM', 'PRACTICAL');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('unverified', 'pending', 'legally_verified', 'fully_accredited');

-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('nursery', 'primary', 'secondary', 'K12');

-- CreateEnum
CREATE TYPE "Curriculum" AS ENUM ('nigerian', 'british', 'montessori', 'other');

-- CreateEnum
CREATE TYPE "GradingSystem" AS ENUM ('percentage', 'waec', 'gpa', 'other');

-- CreateEnum
CREATE TYPE "OwnershipType" AS ENUM ('private', 'mission', 'public');

-- CreateEnum
CREATE TYPE "Title" AS ENUM ('MR', 'MRS', 'MS', 'DR', 'PASTOR', 'REVEREND', 'OTHER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'GRADUATED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'STAFF', 'ADMIN', 'GUARDIAN');

-- CreateTable
CREATE TABLE "attendance" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "studentId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "armId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "session" TEXT NOT NULL,
    "recordedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "order" INTEGER,
    "category" "Category" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "class_master_id" TEXT,
    "capacity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "arms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grading_modules" (
    "id" TEXT NOT NULL,
    "school_id" TEXT,
    "term" TEXT,
    "session" TEXT,
    "name" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "category" "ModuleCategory" NOT NULL DEFAULT 'CA',
    "sequence" INTEGER DEFAULT 0,
    "is_locked" BOOLEAN NOT NULL DEFAULT false,
    "subject_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grading_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grades" (
    "id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "student_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "grading_module_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "arm_id" TEXT,
    "term" TEXT NOT NULL,
    "session" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB DEFAULT '{}',

    CONSTRAINT "grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "academicSessionId" TEXT,
    "schoolId" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "number_of_weeks" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_sessions" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "schoolId" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "currentTermId" TEXT,
    "currentSessionId" TEXT,
    "name" TEXT NOT NULL,
    "short_name" TEXT,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "lga" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" "SchoolType",
    "curriculum" "Curriculum",
    "grading_system" "GradingSystem",
    "ownership_type" "OwnershipType",
    "proprietor" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "motto" TEXT,
    "date_of_inception" TIMESTAMP(3),
    "cac_number" TEXT,
    "cac_certificate_url" TEXT,
    "moe_number" TEXT,
    "moe_certificate_url" TEXT,
    "trcn_url" TEXT,
    "tin" TEXT,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "accountName" TEXT,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'unverified',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "class_id" TEXT,
    "string_id" TEXT,
    "admission_number" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "guardian_phone" TEXT,
    "guardian_email" TEXT,
    "is_fees_paid" BOOLEAN NOT NULL DEFAULT false,
    "gender" "Gender" NOT NULL,
    "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "school_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "staff_id" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "password" TEXT,
    "hashedRt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassToSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClassToSubject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_StaffToSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StaffToSubject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "attendance_classId_date_idx" ON "attendance"("classId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_studentId_date_classId_key" ON "attendance"("studentId", "date", "classId");

-- CreateIndex
CREATE INDEX "classes_school_id_idx" ON "classes"("school_id");

-- CreateIndex
CREATE INDEX "classes_order_idx" ON "classes"("order");

-- CreateIndex
CREATE INDEX "classes_category_idx" ON "classes"("category");

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_school_id_key" ON "classes"("name", "school_id");

-- CreateIndex
CREATE INDEX "arms_class_id_idx" ON "arms"("class_id");

-- CreateIndex
CREATE INDEX "arms_school_id_idx" ON "arms"("school_id");

-- CreateIndex
CREATE INDEX "arms_class_master_id_idx" ON "arms"("class_master_id");

-- CreateIndex
CREATE INDEX "grading_modules_school_id_term_idx" ON "grading_modules"("school_id", "term");

-- CreateIndex
CREATE INDEX "grading_modules_school_id_session_idx" ON "grading_modules"("school_id", "session");

-- CreateIndex
CREATE INDEX "grading_modules_school_id_term_session_idx" ON "grading_modules"("school_id", "term", "session");

-- CreateIndex
CREATE INDEX "grades_school_id_session_term_class_id_idx" ON "grades"("school_id", "session", "term", "class_id");

-- CreateIndex
CREATE INDEX "grades_student_id_subject_id_idx" ON "grades"("student_id", "subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "grades_student_id_subject_id_grading_module_id_term_session_key" ON "grades"("student_id", "subject_id", "grading_module_id", "term", "session");

-- CreateIndex
CREATE INDEX "terms_schoolId_idx" ON "terms"("schoolId");

-- CreateIndex
CREATE INDEX "terms_academicSessionId_idx" ON "terms"("academicSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "terms_academicSessionId_identifier_key" ON "terms"("academicSessionId", "identifier");

-- CreateIndex
CREATE INDEX "academic_sessions_schoolId_idx" ON "academic_sessions"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "academic_sessions_schoolId_identifier_key" ON "academic_sessions"("schoolId", "identifier");

-- CreateIndex
CREATE UNIQUE INDEX "schools_user_id_key" ON "schools"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "schools_name_key" ON "schools"("name");

-- CreateIndex
CREATE UNIQUE INDEX "schools_short_name_key" ON "schools"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "schools_email_key" ON "schools"("email");

-- CreateIndex
CREATE INDEX "schools_state_idx" ON "schools"("state");

-- CreateIndex
CREATE INDEX "schools_lga_idx" ON "schools"("lga");

-- CreateIndex
CREATE INDEX "schools_verification_status_idx" ON "schools"("verification_status");

-- CreateIndex
CREATE UNIQUE INDEX "staff_user_id_key" ON "staff"("user_id");

-- CreateIndex
CREATE INDEX "staff_school_id_idx" ON "staff"("school_id");

-- CreateIndex
CREATE INDEX "students_userId_idx" ON "students"("userId");

-- CreateIndex
CREATE INDEX "students_school_id_idx" ON "students"("school_id");

-- CreateIndex
CREATE INDEX "students_class_id_idx" ON "students"("class_id");

-- CreateIndex
CREATE INDEX "students_string_id_idx" ON "students"("string_id");

-- CreateIndex
CREATE INDEX "students_admission_number_idx" ON "students"("admission_number");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_school_id_key" ON "students"("userId", "school_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_school_id_admission_number_key" ON "students"("school_id", "admission_number");

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

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "_ClassToSubject_B_index" ON "_ClassToSubject"("B");

-- CreateIndex
CREATE INDEX "_StaffToSubject_B_index" ON "_StaffToSubject"("B");

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arms" ADD CONSTRAINT "arms_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arms" ADD CONSTRAINT "arms_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arms" ADD CONSTRAINT "arms_class_master_id_fkey" FOREIGN KEY ("class_master_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_grading_module_id_fkey" FOREIGN KEY ("grading_module_id") REFERENCES "grading_modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms" ADD CONSTRAINT "terms_academicSessionId_fkey" FOREIGN KEY ("academicSessionId") REFERENCES "academic_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms" ADD CONSTRAINT "terms_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_sessions" ADD CONSTRAINT "academic_sessions_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "_ClassToSubject" ADD CONSTRAINT "_ClassToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToSubject" ADD CONSTRAINT "_ClassToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StaffToSubject" ADD CONSTRAINT "_StaffToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StaffToSubject" ADD CONSTRAINT "_StaffToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

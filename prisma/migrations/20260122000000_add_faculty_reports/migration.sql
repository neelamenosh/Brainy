-- CreateTable
CREATE TABLE "FacultyReport" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "facultyId" TEXT NOT NULL,
    "reportType" TEXT NOT NULL DEFAULT 'progress_report',
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "studentIds" TEXT[] NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMPTZ(6),

    CONSTRAINT "FacultyReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_faculty_report_status_created" ON "FacultyReport"("status", "createdAt");

-- CreateIndex
CREATE INDEX "idx_faculty_report_faculty_created" ON "FacultyReport"("facultyId", "createdAt");

-- AddForeignKey
ALTER TABLE "FacultyReport" ADD CONSTRAINT "FacultyReport_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

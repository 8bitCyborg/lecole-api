export interface AssessmentRecordType {
  _id?: string;

  studentId: string;
  schoolId: string;
  classId?: string;
  sessionId: string;
  termId: string;

  subjectScores: {
    subjectId: string;
    ca?: number;
    exam?: number;
    remark?: string;
  }[];

  createdAt?: string;
  updatedAt?: string;
}

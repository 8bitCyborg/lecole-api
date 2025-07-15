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

export interface StudentType {
  _id: string;
  firstName: string;
  lastName: string;
  classId: Class; // Accepts either an ID or full Class object
  age: number;
  dateAdmitted: Date;
  currentClass: string;
  gender: Gender;
  paymentStatus: PaymentStatus;
  schoolId: School;
  createdAt: Date;
  email: string;
  phone: string;
}

export interface ClassType {
  _id: string; // or _id: string, depending on your usage
  name: string;
  schoolId: string;
  classTeacher?: Staff;
  description?: string;
  subjects: string[] | Subject[];
  subjectGroups: { subjectId: Subject; teacherId: string | Staff }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubjectType {
  _id: string; // or _id: string
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
  schoolId: string;
  assignments: {
    teacherId: string;
    classId: string;
  }[];
  maxScore: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SessionType {
  _id: string;
  schoolId: string;
  termsId: string | Term;
  currentTermId: string;
  year: string;
}

export interface TermType {
  _id?: string;
  sessionId: string;
  schoolId: string;
  termIndex: number; // 1, 2, or 3
  name: string; // first, second, or third
  startDate?: Date;
  endDate?: Date;
  status: 'active' | 'ended' | 'active';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentType {
  _id: string;
  name: string;
  type: 'cash' | 'transfer';
  amount: number;
  purpose: string;
  studentId?: string;
  schoolId: string;
  sessionId: string;
  termId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolType {
  _id?: string;

  name: string;
  shortCode?: string;

  founderFirstName: string;
  founderLastName: string;

  dataFounded?: string; // use string for dates in frontend
  address?: string;
  email?: string;
  phone?: string[];
  logoUrl?: string;
  motto?: string;

  subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'; // or import enum type

  currentSessionId?: Session;
  sessionIds: string[]; // or Session[] if populated

  currentTermId?: Term;

  students?: string[]; // or Student[]
  staff?: string[]; // or Staff[]

  gradingScheme: GradingScheme;
}

export interface StaffType {
  _id?: string;
  userId: User;
  gender: 'male' | 'female';
  type?: 'teaching' | 'non-teaching';
  position?: string;
  qualification?: string;
  employmentDate?: string; // ISO string for date
  schoolId?: string; // or School if populated
  teachingSubjects?: string[];
  teachingClasses?: string[];
}

export interface ExpenseType {
  _id: string;
  name: string;
  type: 'cash' | 'transfer';
  amount: number;
  purpose: string;
  schoolId: string;
  sessionId: string;
  termId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionRecordsType {
  finalAverage: number;
  firstTerm: number;
  firstTermId: string | null;
  name: string;
  secondTerm: number;
  secondTermId: string | null;
  thirdTerm: number;
  thirdTermId: string | null;
  studentId: string | null;
}

export interface UserType {
  _id: string;
  email: string;
  loginId: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  password: string;
  schoolId: School;
  createdAt: Date;
  updatedAt: Date;
}

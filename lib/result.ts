// Shared result types + dummy data source.
//
// When the real BISE Multan API is connected, ONLY the backend route
// (app/api/result/route.ts) needs to change. The frontend consumes this
// `ResultResponse` shape and does not talk to any external API directly.

export type SubjectMark = {
  /** Subject name in Urdu */
  name: string
  /** Marks obtained in this subject */
  obtained: number
  /** Total marks for this subject */
  total: number
}

export type StudentResult = {
  studentName: string
  fatherName: string
  rollNumber: string
  examYear: string
  subjects: SubjectMark[]
  obtainedMarks: number
  totalMarks: number
  percentage: string
  grade: string
}

export type ResultResponse =
  | { status: 'ok'; result: StudentResult }
  | { status: 'not_found' }
  | { status: 'invalid' }

// Roll number used for testing until the real API is wired up.
const TEST_ROLL_NUMBER = '111222'

// Realistic Pakistani-style dummy record.
const DUMMY_RESULT: StudentResult = {
  studentName: 'محمد عبداللہ خان',
  fatherName: 'محمد اکرم خان',
  rollNumber: TEST_ROLL_NUMBER,
  examYear: '2025',
  subjects: [
    { name: 'انگریزی', obtained: 78, total: 100 },
    { name: 'اردو', obtained: 81, total: 100 },
    { name: 'ریاضی', obtained: 89, total: 100 },
    { name: 'فزکس', obtained: 76, total: 100 },
    { name: 'کمپیوٹر سائنس', obtained: 92, total: 100 },
    { name: 'اسلامیات', obtained: 84, total: 100 },
  ],
  obtainedMarks: 500,
  totalMarks: 600,
  percentage: '83.33',
  grade: 'A1',
}

/**
 * Look up a result by roll number + exam year.
 *
 * Replace the body of this function with a real BISE Multan API call when
 * the credentials are available (read them from process.env / a secrets
 * manager on the server — never expose them to the client).
 */
export function lookupResult(rollNumber: string, _examYear: string): ResultResponse {
  const roll = rollNumber.trim()

  if (!/^\d{4,10}$/.test(roll)) {
    return { status: 'invalid' }
  }

  if (roll === TEST_ROLL_NUMBER) {
    return { status: 'ok', result: DUMMY_RESULT }
  }

  return { status: 'not_found' }
}

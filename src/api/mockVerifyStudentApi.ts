/**
 * Mock API: POST /verify-student
 * Verifies that a student with the given name exists in the given class
 * by querying the same data source as classes (e.g. teacher class roster).
 */

import { fetchClasses } from './mockClassesApi'

export type VerifyStudentPayload = {
  className: string
  studentName: string
}

export type VerifyStudentResponse = {
  ok: boolean
  message?: string
  studentId?: string
}

const MOCK_DELAY_MS = 400

/**
 * Simulates POST /verify-student. Checks whether a student with the given name
 * exists in the given class (uses default teacher's class data).
 */
export async function verifyStudent(
  payload: VerifyStudentPayload
): Promise<VerifyStudentResponse> {
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS))
  const className = (payload.className || '').trim()
  const studentName = (payload.studentName || '').trim()
  if (!className || !studentName) {
    return { ok: false, message: 'Class name and student name are required.' }
  }
  const classes = await fetchClasses('default')
  const classData = classes[className]
  if (!classData) {
    return { ok: false, message: 'That student cannot be verified.' }
  }
  const normalized = studentName.toLowerCase()
  const student = classData.students.find(
    (s) => s.name.trim().toLowerCase() === normalized
  )
  if (!student) {
    return { ok: false, message: 'That student cannot be verified.' }
  }
  // eslint-disable-next-line no-console
  console.log('[mock] POST /verify-student', payload, '->', student.id)
  return { ok: true, studentId: student.id }
}

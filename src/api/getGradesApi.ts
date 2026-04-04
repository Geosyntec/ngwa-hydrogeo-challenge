/**
 * Teacher grade views: GET /api/teacher-grades, GET /api/grade-submission/:id
 */

import { getApiUrl } from '../app/apiConfig'
import type { SubmitGradesAnswers, SubmitGradesOverallGrades } from './submitGradesApi'

export type GetGradesResponse = {
  gradesSummary: SubmitGradesOverallGrades
  answers: SubmitGradesAnswers
}

/** One row per student per test (latest submission). */
export type TeacherGradeSubmissionRow = {
  submission_id: string
  scenario_id: string
  class_id: string
  class_name: string
  student_id: string
  first_name: string
  last_name: string
  flow_right: number
  flow_total: number
  gradient_right: number
  gradient_total: number
  velocity_right: number
  velocity_total: number
  percentage: number
  submitted_at: string | null
}

export type TeacherGradesResponse = {
  submissions: TeacherGradeSubmissionRow[]
}

function teacherQueryParams(teacherEmail: string, teacherId?: string): URLSearchParams {
  const q = new URLSearchParams()
  const id = teacherId?.trim()
  if (id) q.set('teacherID', id)
  else q.set('teacher', teacherEmail.trim())
  return q
}

export async function fetchTeacherGrades(
  teacherEmail: string,
  teacherUserId?: string,
): Promise<TeacherGradesResponse> {
  const base = getApiUrl()
  const q = teacherQueryParams(teacherEmail, teacherUserId)
  const res = await fetch(`${base}/api/teacher-grades?${q}`, {
    credentials: 'include',
  })
  const data = (await res.json().catch(() => ({}))) as {
    detail?: string
    submissions?: TeacherGradeSubmissionRow[]
  }
  if (!res.ok) {
    const msg = typeof data.detail === 'string' ? data.detail : 'Failed to load grades.'
    throw new Error(msg)
  }
  return { submissions: data.submissions ?? [] }
}

export async function fetchGradeSubmissionDetail(
  submissionId: string,
  teacherEmail: string,
  teacherUserId?: string,
): Promise<GetGradesResponse> {
  const base = getApiUrl()
  const q = teacherQueryParams(teacherEmail, teacherUserId)
  const res = await fetch(
    `${base}/api/grade-submission/${encodeURIComponent(submissionId.trim())}?${q}`,
    { credentials: 'include' },
  )
  const data = (await res.json().catch(() => ({}))) as GetGradesResponse & {
    detail?: string
  }
  if (!res.ok) {
    const msg = typeof data.detail === 'string' ? data.detail : 'Failed to load submission.'
    throw new Error(msg)
  }
  const answers = data.answers && typeof data.answers === 'object' ? data.answers : {}
  const g = data.gradesSummary
  if (!g) {
    throw new Error('Invalid response from server.')
  }
  return {
    gradesSummary: g,
    answers: answers as SubmitGradesAnswers,
  }
}

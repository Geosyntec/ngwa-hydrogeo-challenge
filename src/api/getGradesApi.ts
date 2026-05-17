/**
 * Teacher grade views: GET /api/teacher-grades, GET /api/grade-submission/:id
 */

import { getApiUrl } from '../app/apiConfig'
import {
  normalizeSubmitGradesAnswers,
  type SubmitGradesAnswers,
  type SubmitGradesOverallGrades,
} from './submitGradesApi'

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
  const g = data.gradesSummary
  if (!g) {
    throw new Error('Invalid response from server.')
  }
  return {
    gradesSummary: g,
    answers: normalizeSubmitGradesAnswers(data.answers),
  }
}

export async function deleteGradeSubmissionsForStudentScenario(
  studentId: string,
  scenarioId: string,
  teacherEmail: string,
  teacherUserId?: string,
): Promise<{ ok: boolean; deleted: number }> {
  const base = getApiUrl()
  const q = new URLSearchParams()
  q.set('studentId', studentId.trim())
  q.set('scenarioId', scenarioId.trim())
  teacherQueryParams(teacherEmail, teacherUserId).forEach((v, k) => q.set(k, v))
  const res = await fetch(`${base}/api/grade-submissions?${q}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  const data = (await res.json().catch(() => ({}))) as {
    detail?: string
    ok?: boolean
    deleted?: number
  }
  if (!res.ok) {
    const msg = typeof data.detail === 'string' ? data.detail : 'Failed to reset submission.'
    throw new Error(msg)
  }
  return { ok: data.ok ?? true, deleted: data.deleted ?? 0 }
}

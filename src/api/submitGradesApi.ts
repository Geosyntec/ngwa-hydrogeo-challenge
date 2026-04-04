/**
 * POST /api/submit-grades — persists a row in `grade_submissions` (see bootstrap_db schema).
 */

import { getApiUrl } from '../app/apiConfig'

/** Overall grades shown to the student at the end of the practice challenge. */
export type SubmitGradesOverallGrades = {
  flowRight: number
  flowTotal: number
  gradientRight: number
  gradientTotal: number
  velocityRight: number
  velocityTotal: number
  /** Overall percentage (0–100). */
  percentage: number
}

/** Question key -> student's answer (string or number). */
export type SubmitGradesAnswers = Record<string, string | number>

/**
 * Request body keys match `grade_submissions` columns (excluding generated id and submitted_at).
 */
export type GradeSubmissionPayload = {
  student_id: string
  scenario_id: string
  selected_wells: string[]
  answers: SubmitGradesAnswers
  flow_right: number
  flow_total: number
  gradient_right: number
  gradient_total: number
  velocity_right: number
  velocity_total: number
  percentage: number
}

export type SubmitGradesResponse = {
  ok: boolean
  submission_id?: string
  message?: string
}

export async function submitGrades(
  payload: GradeSubmissionPayload,
): Promise<SubmitGradesResponse> {
  const base = getApiUrl()
  const res = await fetch(`${base}/api/submit-grades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await res.json().catch(() => ({}))) as {
    detail?: string | Array<{ msg?: string }>
    ok?: boolean
    submission_id?: string
    message?: string
  }

  if (!res.ok) {
    const detail = data.detail
    const msg =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail) && detail[0]?.msg
          ? String(detail[0].msg)
          : `Submit failed (${res.status}).`
    throw new Error(msg)
  }

  return {
    ok: data.ok ?? true,
    submission_id: data.submission_id,
    message: data.message,
  }
}

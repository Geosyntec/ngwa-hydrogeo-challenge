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

/** One graded question in a submission (`grade_submissions.answers` JSON). */
export type SubmitGradesAnswerEntry = {
  /** Student's submitted answer (string or number). */
  value: string | number
  /**
   * Present only for submissions graded on submit (`dispatchReevaluateAllAnswersForGrading`).
   * Omitted for legacy JSONB rows that stored a scalar per key.
   */
  isCorrect?: boolean
}

/** Question id -> answer entry. */
export type SubmitGradesAnswers = Record<string, SubmitGradesAnswerEntry>

/** Coerce stored JSON (new shape or legacy scalar per key) for display. */
export function normalizeSubmitGradesAnswers(raw: unknown): SubmitGradesAnswers {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {}
  }
  const out: SubmitGradesAnswers = {}
  for (const [key, entry] of Object.entries(raw as Record<string, unknown>)) {
    if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
      const obj = entry as Record<string, unknown>
      const v = obj.value ?? obj.answer
      if ('isCorrect' in obj || 'value' in obj || 'answer' in obj || v !== undefined) {
        const value =
          typeof v === 'number' || typeof v === 'string'
            ? v
            : v != null
              ? String(v)
              : ''
        if ('isCorrect' in obj) {
          out[key] = { value, isCorrect: Boolean(obj.isCorrect) }
        } else {
          out[key] = { value }
        }
        continue
      }
    }
    if (typeof entry === 'string' || typeof entry === 'number') {
      out[key] = { value: entry }
    }
  }
  return out
}

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

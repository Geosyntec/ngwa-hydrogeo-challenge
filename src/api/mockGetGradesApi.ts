/**
 * Mock API: GET /get-grades?studentId=STUDENT_UUID
 * Fetches a student's grades by their student UUID.
 * Response includes grades summary and individual answers.
 */

import type {
  SubmitGradesOverallGrades,
  SubmitGradesAnswers,
} from './mockSubmitGradesApi'

export type GetGradesResponse = {
  gradesSummary: SubmitGradesOverallGrades
  answers: SubmitGradesAnswers
}

const MOCK_DELAY_MS = 400

/** In-memory store: student UUID -> grades (for demo, we also return default if unknown). */
const gradesByStudentId = new Map<string, GetGradesResponse>()

/** Seed with sample data for demo. Callers can pass any student UUID; we return this default if not found. */
const defaultGrades: GetGradesResponse = {
  gradesSummary: {
    flowRight: 12,
    flowTotal: 14,
    gradientRight: 4,
    gradientTotal: 5,
    velocityRight: 6,
    velocityTotal: 7,
    percentage: 85,
  },
  answers: {
    HighestWaterTableName: 'C',
    HighestWaterTableValue: 98,
    LowestWaterTableName: 'B',
    LowestWaterTableValue: 100,
    RemainingWellName: 'A',
    RemainingWellValue: 105,
    DiffBtwnHighestLowest: 2,
    DiffBtwnHighestMiddle: 5,
    DiffBtwnHighestLowest2: 2,
    DiffBtwnHighestMiddle2: 5,
    ElevationRatio: '0.71',
    DistanceHighestLowest: 450,
    ElevResult_X_DistanceHighMid: 320,
    SelectedDirection: 'NW',
    WhatIsDistanceYValue: 320,
    WhatIsDistanceYValue2: 320,
    Gradient: '0.0219',
    Gradient2: '0.0219',
    Conductivity: 30,
    Porosity: 0.2,
    Conductivity2: 30,
    Porosity2: 0.2,
    HorizontalVelocity: 3.29,
  },
}

/**
 * Simulates GET /get-grades. Returns grades summary and individual answers
 * for the given student UUID. Uses stored data if present, otherwise returns
 * default demo data.
 */
export async function getGrades(
  studentId: string
): Promise<GetGradesResponse> {
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS))
  const stored = gradesByStudentId.get(studentId)
  if (stored) {
    // eslint-disable-next-line no-console
    console.log('[mock] GET /get-grades', studentId, 'from store')
    return stored
  }
  // eslint-disable-next-line no-console
  console.log('[mock] GET /get-grades', studentId, 'default')
  return { ...defaultGrades }
}

/**
 * Optional: store grades for a student (e.g. when submit-grades includes studentId).
 * Allows get-grades to return submitted data for that student.
 */
export function setGradesForStudent(
  studentId: string,
  data: GetGradesResponse
): void {
  gradesByStudentId.set(studentId, data)
}

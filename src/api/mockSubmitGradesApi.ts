/**
 * Mock API: POST /submit-grades
 * Called when the student submits results after completing the test scenario.
 */

/** Overall grades shown to the student at the end of the practice challenge. */
export type SubmitGradesOverallGrades = {
  flowRight: number;
  flowTotal: number;
  gradientRight: number;
  gradientTotal: number;
  velocityRight: number;
  velocityTotal: number;
  /** Overall percentage (0–100). */
  percentage: number;
};

/** Question key -> student's answer (string or number). */
export type SubmitGradesAnswers = Record<string, string | number>;

export type SubmitGradesPayload = {
  /** Current scenario id (e.g. "test-1"). */
  scenarioId: string;
  /** List of selected well ids in order (one, two, three). */
  selectedWells: string[];
  /** All answers: key is question key, value is the student's answer. */
  answers: SubmitGradesAnswers;
  /** Overall grades displayed at the end of the practice challenge. */
  grades: SubmitGradesOverallGrades;
};

export type SubmitGradesResponse = {
  ok: boolean;
  message?: string;
};

const MOCK_DELAY_MS = 500;

/**
 * Simulates POST /submit-grades. Resolves with { ok: true } after a short delay.
 * In a real app this would send the payload to the server.
 */
export async function submitGrades(
  payload: SubmitGradesPayload
): Promise<SubmitGradesResponse> {
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
  // eslint-disable-next-line no-console
  console.log("[mock] POST /submit-grades", payload);
  return { ok: true, message: "Grades submitted." };
}

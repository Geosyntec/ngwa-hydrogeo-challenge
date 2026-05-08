export const ROUTES = {
  home: '/',
  gettingStarted: '/getting-started',
  scenario: '/scenario',
  scenarioTest: '/scenario/test/:testId',
  test: '/test',
  reference: '/reference',
  about: '/about',
  login: '/login',
  register: '/register',
  verifyEmail: '/verify-email',
  resetPassword: '/reset-password',
  grading: '/grading',
  gradingClasses: '/grading/classes',
  gradingGrades: '/grading/grades',
  gradingCreateTest: '/grading/create-test',
} as const

/** Student test flow requires `?teacherID=<teacher user UUID>`; optional `testID=<scenario id>`. */
export function testHrefWithTeacherId(
  teacherId: string,
  testId?: string,
): string {
  const q = new URLSearchParams({ teacherID: teacherId.trim() })
  const tid = testId?.trim()
  if (tid) q.set("testID", tid)
  return `${ROUTES.test}?${q}`
}

export const NAV_ITEMS = [
  { path: ROUTES.home, label: 'Home' },
  // { path: ROUTES.gettingStarted, label: 'Getting Started' },
  { path: ROUTES.scenario, label: 'Practice' },
  // { path: ROUTES.reference, label: 'Reference' },
  // { path: ROUTES.about, label: 'About' },
] as const

export const ROUTES = {
  home: '/',
  gettingStarted: '/getting-started',
  scenario: '/scenario',
  scenarioTest: '/scenario/test/:testId',
  test: '/test',
  reference: '/reference',
  about: '/about',
  login: '/login',
  grading: '/grading',
  gradingClasses: '/grading/classes',
  gradingGrades: '/grading/grades',
  gradingCreateTest: '/grading/create-test',
} as const

export const NAV_ITEMS = [
  { path: ROUTES.home, label: 'Home' },
  { path: ROUTES.gettingStarted, label: 'Getting Started' },
  { path: ROUTES.scenario, label: 'Practice' },
  { path: ROUTES.test, label: 'Take the Test' },
  { path: ROUTES.reference, label: 'Reference' },
  { path: ROUTES.about, label: 'About' },
] as const

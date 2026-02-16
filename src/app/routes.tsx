export const ROUTES = {
  home: '/',
  gettingStarted: '/getting-started',
  scenario: '/scenario',
  scenarioTest: '/scenario/test/:testId',
  reference: '/reference',
  about: '/about',
  grading: '/grading',
  gradingClasses: '/grading/classes',
  gradingGrades: '/grading/grades',
  gradingCreateTest: '/grading/create-test',
} as const

export const NAV_ITEMS = [
  { path: ROUTES.home, label: 'Home' },
  { path: ROUTES.gettingStarted, label: 'Getting Started' },
  { path: ROUTES.scenario, label: 'The Challenge' },
  { path: ROUTES.reference, label: 'Reference' },
  { path: ROUTES.about, label: 'About' },
  { path: ROUTES.grading, label: 'Teacher Grading' },
] as const

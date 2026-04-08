import { Navigate, useSearchParams } from 'react-router-dom'
import Scenario from '../features/scenario/Scenario'
import { ROUTES } from '../app/routes'
import { getTestScenarioById } from '../features/scenario/testScenario'

function readTeacherIdFromSearch(params: URLSearchParams): string {
  return (
    params.get('teacherID')?.trim() ||
    params.get('teacherId')?.trim() ||
    ''
  )
}

function readTestIdFromSearch(params: URLSearchParams): string {
  return (
    params.get('testID')?.trim() ||
    params.get('testId')?.trim() ||
    ''
  )
}

export default function ScenarioPage({ isTest = false }: { isTest?: boolean }) {
  const [params] = useSearchParams()
  const teacherID = readTeacherIdFromSearch(params)
  const testID = readTestIdFromSearch(params)

  // Students use /test while signed out; only require a teacher id in the link (not app auth).
  if (isTest && !teacherID) {
    return <Navigate to={ROUTES.home} replace />
  }

  if (isTest && !getTestScenarioById(testID)) {
    return <Navigate to={ROUTES.home} replace />
  }

  return (
    <Scenario
      isTest={isTest}
      teacherIdForTest={isTest ? teacherID : undefined}
      testId={isTest ? testID || undefined : undefined}
    />
  )
}

import { Navigate, useSearchParams } from 'react-router-dom'
import Scenario from '../features/scenario/Scenario'
import { ROUTES } from '../app/routes'
import { getTestScenarioById } from '../features/scenario/testScenario'

export default function ScenarioPage({ isTest = false }: { isTest?: boolean }) {
  const [params] = useSearchParams()
  const teacherID = params.get('teacherID')?.trim() ?? ''
  const testID = params.get('testID')?.trim() ?? ''

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

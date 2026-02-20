import Scenario from '../features/scenario/Scenario'

export default function ScenarioPage({ isTest = false }: { isTest?: boolean }) {
  return <Scenario isTest={isTest} />
}

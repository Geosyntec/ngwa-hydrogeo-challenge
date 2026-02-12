import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import AppLayout from './components/Layout/AppLayout'
import LandingPage from './pages/LandingPage'
import GettingStartedPage from './pages/GettingStartedPage'
import ScenarioPage from './pages/ScenarioPage'
import ReferencePage from './pages/ReferencePage'
import AboutPage from './pages/AboutPage'
import TeacherGradingPage from './pages/TeacherGradingPage'
import { ROUTES } from './app/routes'

const theme = createTheme()

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.home} element={<LandingPage />} />
            <Route path={ROUTES.gettingStarted} element={<GettingStartedPage />} />
            <Route path={ROUTES.scenario} element={<ScenarioPage />} />
            <Route path={ROUTES.scenarioTest} element={<ScenarioPage />} />
            <Route path={ROUTES.reference} element={<ReferencePage />} />
            <Route path={ROUTES.about} element={<AboutPage />} />
            <Route path={ROUTES.grading} element={<TeacherGradingPage />} />
            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

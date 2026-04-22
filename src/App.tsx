import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { appTheme } from './theme/theme'
import AppLayout from './components/Layout/AppLayout'
import TeacherPortalLayout from './components/Layout/TeacherPortalLayout'
import ErrorBoundary from './components/ErrorBoundary'
import AuthGuard from './components/AuthGuard'
import LandingPage from './pages/LandingPage'
import GettingStartedPage from './pages/GettingStartedPage'
import ScenarioPage from './pages/ScenarioPage'
import ReferencePage from './pages/ReferencePage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import TeacherGradingPage from './pages/TeacherGradingPage'
import ManageClassesPage from './pages/teacher/ManageClassesPage'
import ViewGradesPage from './pages/teacher/ViewGradesPage'
import CreateTestPage from './pages/teacher/CreateTestPage'
import { ROUTES } from './app/routes'
import { getRouterBasename } from './app/routerBasename'

export default function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <BrowserRouter basename={getRouterBasename()}>
          <Routes>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.home} element={<LandingPage />} />
            <Route path={ROUTES.gettingStarted} element={<GettingStartedPage />} />
            <Route path={ROUTES.scenario} element={<ScenarioPage isTest={false} />} />
            <Route path={ROUTES.test} element={<ScenarioPage isTest />} />
            <Route path={ROUTES.reference} element={<ReferencePage />} />
            <Route path={ROUTES.about} element={<AboutPage />} />
            <Route path={ROUTES.login} element={<LoginPage />} />
            <Route path={ROUTES.verifyEmail} element={<VerifyEmailPage />} />
            <Route path={ROUTES.resetPassword} element={<ResetPasswordPage />} />
            <Route element={<AuthGuard />}>
              <Route element={<TeacherPortalLayout />}>
                <Route path={ROUTES.grading} element={<TeacherGradingPage />} />
                <Route path={ROUTES.gradingClasses} element={<ManageClassesPage />} />
                <Route path={ROUTES.gradingGrades} element={<ViewGradesPage />} />
                <Route path={ROUTES.gradingCreateTest} element={<CreateTestPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

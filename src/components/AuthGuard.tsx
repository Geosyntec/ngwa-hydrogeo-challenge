import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectIsAuthenticated } from '../features/auth/authSlice'
import { ROUTES } from '../app/routes'

/**
 * Protects /grading routes: redirects to login when not authenticated,
 * preserving the attempted URL so the user can be sent back after login.
 */
export default function AuthGuard() {
  const location = useLocation()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.login}
        replace
        state={{ from: location }}
      />
    )
  }

  return <Outlet />
}

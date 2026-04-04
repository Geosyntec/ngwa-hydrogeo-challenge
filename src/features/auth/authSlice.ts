import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const AUTH_KEY = 'ngwa-auth'

export interface AuthState {
  isAuthenticated: boolean
  user: { name: string; id?: string } | null
}

const loadStored = (): AuthState => {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY)
    if (raw) {
      const { isAuthenticated, user } = JSON.parse(raw) as AuthState
      if (isAuthenticated && user) {
        const id = typeof user.id === 'string' ? user.id.trim() : ''
        if (!id) {
          sessionStorage.removeItem(AUTH_KEY)
          return { isAuthenticated: false, user: null }
        }
        return { isAuthenticated: true, user: { name: user.name, id } }
      }
    }
  } catch {
    // ignore
  }
  return { isAuthenticated: false, user: null }
}

const initialState: AuthState = loadStored()

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(
      s,
      a: PayloadAction<{ username: string; password?: string; id?: string }>,
    ) {
      const name = (a.payload.username || '').trim()
      const id = (a.payload.id ?? '').trim()
      if (!name || !id) return
      s.isAuthenticated = true
      s.user = { name, id }
      try {
        sessionStorage.setItem(
          AUTH_KEY,
          JSON.stringify({ isAuthenticated: true, user: s.user }),
        )
      } catch {
        // ignore
      }
    },
    logout(s) {
      s.isAuthenticated = false
      s.user = null
      try {
        sessionStorage.removeItem(AUTH_KEY)
      } catch {
        // ignore
      }
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer

export const selectIsAuthenticated = (s: { auth: AuthState }) =>
  s.auth.isAuthenticated
export const selectAuthUser = (s: { auth: AuthState }) => s.auth.user

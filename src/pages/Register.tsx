import { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material'
import { validatePassword } from '../utils/passwordValidation'
import { register as registerApi } from '../api/mockRegisterApi'

export type RegisterProps = {
  onBack: () => void
}

export default function Register({ onBack }: RegisterProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('Email is required.')
      return
    }
    const validation = validatePassword(password)
    if (!validation.valid) {
      setError(validation.errors[0] ?? 'Invalid password.')
      return
    }
    setLoading(true)
    try {
      await registerApi({ email: trimmedEmail, password })
      setSuccess(true)
    } catch (err: any) {
      setError(err?.message ?? 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography color="success.main" sx={{ mb: 2 }}>
          An email has been sent to <strong>{email.trim()}</strong> for verification.
          Please check your inbox and follow the link to verify your account.
        </Typography>
        <Button fullWidth variant="outlined" onClick={onBack}>
          Back to sign in
        </Button>
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="register-email"
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="register-password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        helperText="Longer than 8 characters, with a capital letter, number, and special character."
        error={!!error}
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ mt: 3, mb: 1 }}
      >
        {loading ? 'Registering…' : 'Register'}
      </Button>
      <Button fullWidth variant="text" onClick={onBack} sx={{ mb: 2 }}>
        Back to sign in
      </Button>
    </Box>
  )
}

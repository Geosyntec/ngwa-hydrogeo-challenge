import { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material'
import { recoverPassword as recoverPasswordApi } from '../api/mockRecoverPasswordApi'

export type RecoverPasswordProps = {
  onBack: () => void
}

export default function RecoverPassword({ onBack }: RecoverPasswordProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('Email is required.')
      return
    }
    setLoading(true)
    try {
      await recoverPasswordApi({ email: trimmedEmail })
      setSent(true)
    } catch (err: any) {
      setError(err?.message ?? 'Request failed.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography color="success.main" sx={{ mb: 2 }}>
          A password reset link has been sent to <strong>{email.trim()}</strong>.
          Please check your inbox and use the link to set a new password.
        </Typography>
        <Button fullWidth variant="outlined" onClick={onBack}>
          Back to sign in
        </Button>
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Enter your email address and we&apos;ll send you a link to reset your password.
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="recover-email"
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        {loading ? 'Sending…' : 'Send reset link'}
      </Button>
      <Button fullWidth variant="text" onClick={onBack} sx={{ mb: 2 }}>
        Back to sign in
      </Button>
    </Box>
  )
}

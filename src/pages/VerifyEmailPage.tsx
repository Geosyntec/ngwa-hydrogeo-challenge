import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material'
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'
import { ROUTES } from '../app/routes'
import { verifyEmail, resendVerification } from '../api/registerApi'

type Status = 'loading' | 'verified' | 'expired' | 'error'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''

  const [status, setStatus] = useState<Status>(token ? 'loading' : 'expired')
  const [resendEmail, setResendEmail] = useState('')
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('expired')
      return
    }
    verifyEmail({ token })
      .then(() => setStatus('verified'))
      .catch((err: { expired?: boolean; message?: string }) => {
        setStatus(err?.expired ? 'expired' : 'error')
      })
  }, [token])

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    setResendError('')
    const email = resendEmail.trim().toLowerCase()
    if (!email) {
      setResendError('Email is required.')
      return
    }
    try {
      await resendVerification({ email })
      setResendSuccess(true)
    } catch (err: any) {
      setResendError(err?.message ?? 'Failed to send verification email.')
    }
  }

  if (status === 'loading') {
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">Verifying your email…</Typography>
        </Box>
      </Container>
    )
  }

  if (status === 'verified') {
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CheckCircleOutline sx={{ fontSize: 64, color: 'success.main' }} />
          <Typography variant="h5" component="h1">
            You're verified and ready to go
          </Typography>
          <Typography color="text.secondary" textAlign="center">
            Your email has been verified. You can now sign in to access the Teacher Portal.
          </Typography>
          <Button variant="contained" onClick={() => navigate(ROUTES.login)} sx={{ mt: 2 }}>
            Sign in
          </Button>
        </Box>
      </Container>
    )
  }

  if (status === 'expired' || status === 'error') {
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {status === 'expired' ? 'Verification link expired' : 'Verification failed'}
          </Typography>
          <Typography sx={{ mb: 2 }}>
            {status === 'expired'
              ? 'This link has expired. Please enter your email below to receive a new verification link.'
              : 'Something went wrong. You can request a new verification link below.'}
          </Typography>
          {resendSuccess ? (
            <Typography color="success.main" sx={{ mb: 2 }}>
              A new verification email has been sent. Check your inbox and spam folder.
            </Typography>
          ) : (
            <Box component="form" onSubmit={handleResend} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              {resendError && (
                <Typography color="error" variant="body2">
                  {resendError}
                </Typography>
              )}
              <Button type="submit" variant="contained">
                Send new verification link
              </Button>
            </Box>
          )}
          <Button onClick={() => navigate(ROUTES.login)} sx={{ mt: 2 }}>
            Back to sign in
          </Button>
        </Box>
      </Container>
    )
  }

  return null
}

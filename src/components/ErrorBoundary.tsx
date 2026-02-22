import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Box, Container, Typography } from '@mui/material'

type Props = { children: ReactNode }
type State = { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.error) {
      const is500 = this.state.error.message === '500'
      return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="error" gutterBottom>
              {is500 ? '500 Server Error' : 'Something went wrong'}
            </Typography>
            <Typography color="text.secondary">
              {is500
                ? 'The server could not be reached. Make sure the backend is running (e.g. run npm run dev).'
                : this.state.error.message}
            </Typography>
          </Box>
        </Container>
      )
    }
    return this.props.children
  }
}

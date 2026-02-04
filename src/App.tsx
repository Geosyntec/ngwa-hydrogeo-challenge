import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import Scenario from './features/scenario/Scenario'

const theme = createTheme()

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Scenario />
    </ThemeProvider>
  )
}

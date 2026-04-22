import type { Theme } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'

/** Solid primary fill for contained buttons (all color props resolve to primary). */
function containedPrimaryBackground({ theme }: { theme: Theme }) {
  return {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: 'none',
    },
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    brown: Palette['primary']
  }
  interface PaletteOptions {
    brown?: PaletteOptions['primary']
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    brown: true
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    brown: true
  }
}

/** Brand / UI palette: blues, peach warning, tan brown */
export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#006699',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#5f8bc6',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#fca965',
      contrastText: '#1f1f1f',
    },
    brown: {
      main: '#ddb498',
      contrastText: '#1f1f1f',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: containedPrimaryBackground,
        containedSecondary: containedPrimaryBackground,
        containedSuccess: containedPrimaryBackground,
        containedError: containedPrimaryBackground,
        containedInfo: containedPrimaryBackground,
        containedWarning: containedPrimaryBackground,
        containedInherit: containedPrimaryBackground,
      },
    },
  },
})

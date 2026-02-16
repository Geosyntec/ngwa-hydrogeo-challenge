import { useState } from 'react'
import {
  Box,
  Checkbox,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import UnfoldMore from '@mui/icons-material/UnfoldMore'
import UnfoldLess from '@mui/icons-material/UnfoldLess'

/** Where to anchor the card relative to the well marker (legacy: optimal visibility when 3 wells selected). */
export type WellInfoCardPlacement = 'above' | 'below' | 'left' | 'right'

export type WellInfoCardProps = {
  well: {
    Name: string
    GroundElevationFt: number
    StaticElevationFt: number
    PumpingElevationFt: number
    IsPumpingOn?: boolean
    GeologyNew?: { depthFt: number; lithology: string; conductivityK?: number; porosityPct?: number }[]
  }
  allowPumping: boolean
  isTest: boolean
  /** Top/left in map coords (px) to place card; you pass marker coords + offset */
  top: number
  left: number
  /** Whether the card should be visible */
  open: boolean
  /** Where to anchor the card relative to the marker (default: above). Set by MapView when 3 wells selected. */
  placement?: WellInfoCardPlacement
  /** Optional: toggle pump */
  onTogglePumping?: (on: boolean) => void
}

/**
 * A non-modal hover card that anchors near a well marker.
 * G/S/P and pumping are always visible; Geology & Hydrology is hidden by default
 * and toggled with an icon (legacy expand/collapse behavior). Card has a max width
 * with horizontal/vertical scroll when content overflows.
 */
const PLACEMENT_STYLES: Record<
  WellInfoCardPlacement,
  { transform: string; transformOrigin?: string }
> = {
  above: { transform: 'translate(8px, -100%)' },
  below: { transform: 'translate(8px, 24px)' },
  left: { transform: 'translate(calc(-100% - 8px), -50%)', transformOrigin: 'top center' },
  right: { transform: 'translate(8px, -50%)', transformOrigin: 'top center' },
}

export default function WellInfoCard({
  well,
  allowPumping,
  isTest,
  top,
  left,
  open,
  placement = 'above',
  onTogglePumping,
}: WellInfoCardProps) {
  const [geologyExpanded, setGeologyExpanded] = useState(false)

  const OFFSET_X = 14
  const OFFSET_Y = placement === 'above' || placement === 'below' ? -8 : 0

  const placementStyle = PLACEMENT_STYLES[placement]

  return (
    <Box
      aria-hidden={!open}
      sx={{
        position: 'absolute',
        top: top + OFFSET_Y,
        left: left + OFFSET_X,
        ...placementStyle,
        zIndex: 2,
        display: open ? 'block' : 'none',
        maxWidth: 380,
        maxHeight: '70vh',
        overflowX: 'auto',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        border: (t) => `1px solid ${t.palette.divider}`,
        boxShadow: 3,
        borderRadius: 1.5,
        p: 1.25,
        pointerEvents: 'auto',
      }}
    >
      <Stack direction="row" spacing={1} sx={{ minWidth: 'min-content' }}>
        <Box sx={{ flexShrink: 0 }}>
          <Stack direction="row" alignItems="flex-start" spacing={0.5}>
            <IconButton
              size="small"
              onClick={() => setGeologyExpanded((e) => !e)}
              aria-label={geologyExpanded ? 'Hide Geology & Hydrology' : 'Show Geology & Hydrology'}
              sx={{ mt: -0.5, mr: 0.25 }}
            >
              {geologyExpanded ? (
                <UnfoldLess fontSize="small" />
              ) : (
                <UnfoldMore fontSize="small" />
              )}
            </IconButton>
            <Stack spacing={0.5}>
              <Row label="G" value={`${well.GroundElevationFt}`} />
              <Row label="S" value={`${well.StaticElevationFt}`} />
              <Row label="P" value={`${well.PumpingElevationFt}`} />
            </Stack>
          </Stack>

          {allowPumping && (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
              <Checkbox
                size="small"
                checked={!!well.IsPumpingOn}
                onChange={(e) => onTogglePumping?.(e.target.checked)}
                disabled={isTest}
              />
              <Typography variant="body2" color={isTest ? 'text.disabled' : 'text.primary'}>
                Pumping ON
              </Typography>
            </Stack>
          )}
          <Box sx={{ mt: 1, opacity: 0.6 }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{well.Name}</Typography>
          </Box>
        </Box>

        {geologyExpanded && (
          <>
            <Box sx={{ borderLeft: (t) => `1px solid ${t.palette.divider}`, alignSelf: 'stretch', flexShrink: 0 }} />
            <Box sx={{ flexShrink: 0 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Geology & Hydrology</Typography>
              <Table size="small" sx={{ width: 300 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Depth (ft)</TableCell>
                    <TableCell>Lithology</TableCell>
                    <TableCell>K</TableCell>
                    <TableCell>Porosity (%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(well.GeologyNew ?? []).map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.depthFt}</TableCell>
                      <TableCell>{r.lithology}</TableCell>
                      <TableCell>{r.conductivityK ?? ''}</TableCell>
                      <TableCell>{r.porosityPct ?? ''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </>
        )}
      </Stack>
    </Box>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ fontWeight: 700, width: 16, textAlign: 'center' }}>{label}</Box>
      <Box sx={{ fontFamily: 'monospace' }}>{value}</Box>
    </Stack>
  )
}
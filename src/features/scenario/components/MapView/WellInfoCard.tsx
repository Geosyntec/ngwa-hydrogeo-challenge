import { Box, Checkbox, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'

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
  /** Optional: toggle pump */
  onTogglePumping?: (on: boolean) => void
}

/**
 * A non-modal hover card that anchors near a well marker.
 * This component is purely presentational—no focus trapping, no portal.
 */
export default function WellInfoCard({
  well,
  allowPumping,
  isTest,
  top,
  left,
  open,
  onTogglePumping,
}: WellInfoCardProps) {
  // Offset the card slightly so it doesn’t cover the marker
  const OFFSET_X = 14; // px to the right of the marker
  const OFFSET_Y = -8; // px above the marker center

  return (
    <Box
      aria-hidden={!open}
      sx={{
        position: 'absolute',
        top: top + OFFSET_Y,
        left: left + OFFSET_X,
        transform: 'translate(8px, -100%)', // to the top-right of marker
        zIndex: 2,
        display: open ? 'block' : 'none',
        minWidth: 280,
        maxWidth: 360,
        bgcolor: 'background.paper',
        border: (t) => `1px solid ${t.palette.divider}`,
        boxShadow: 3,
        borderRadius: 1.5,
        p: 1.25,
        pointerEvents: 'auto', // allow hover inside if needed
      }}
    >
      <Stack direction="row" spacing={2}>
        <Box>
          <Stack spacing={0.5}>
            <Row label="G" value={`${well.GroundElevationFt}`} />
            <Row label="S" value={`${well.StaticElevationFt}`} />
            <Row label="P" value={`${well.PumpingElevationFt}`} />
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

        <Box sx={{ borderLeft: (t) => `1px solid ${t.palette.divider}`, mx: 1 }} />

        <Box>
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
import { Box, Checkbox, Divider, Popover, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { selectScenarioState, selectWellById, setWellPumping } from '../../ScenarioSlice'

interface Props {
  wellId: string
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
}

export default function PopoverWellInfo({ wellId, anchorEl, open, onClose }: Props) {
  const dispatch = useAppDispatch()
  const { allowPumping, isTest } = useAppSelector(selectScenarioState)
  const well = useAppSelector(selectWellById(wellId))

  if (!well) return null

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      slotProps={{ paper: { sx: { p: 1.5, maxWidth: 420 } } }}
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
                onChange={(e) => dispatch(setWellPumping({ id: well.id, on: e.target.checked }))}
                disabled={isTest}
              />
              <Typography variant="body2" color={isTest ? 'text.disabled' : 'text.primary'}>
                Pumping ON
              </Typography>
            </Stack>
          )}

          {well.IsSelected && (
            <Box sx={{ mt: 1, opacity: 0.6 }}>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {well.Name}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Geology & Hydrology
          </Typography>
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
    </Popover>
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

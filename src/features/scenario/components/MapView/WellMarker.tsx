import { memo, useCallback, useRef } from 'react'
import { Box, Button } from '@mui/material'
import RoomIcon from '@mui/icons-material/Room'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { selectWellById, selectAllWellsSelected, selectScenarioState, selectWell, setOpenWellPopover } from '../../ScenarioSlice'
import PopoverWellInfo from './PopoverWellInfo'

interface Props { wellId: string }

const WellMarker = memo(({ wellId }: Props) => {
  const dispatch = useAppDispatch()
  const well = useAppSelector(selectWellById(wellId))
  const allSelected = useAppSelector(selectAllWellsSelected)
  const { openWellPopoverId } = useAppSelector(selectScenarioState)
  const isOpen = openWellPopoverId === wellId

  const anchorRef = useRef<HTMLButtonElement | null>(null)

  if (!well) return null

  const handleSelect = useCallback(() => {
    dispatch(selectWell(well.id))
  }, [dispatch, well?.id])

  const togglePopover = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(setOpenWellPopover(isOpen ? null : wellId))
  }, [dispatch, isOpen, wellId])

  const isVisible = !allSelected || (allSelected && well.IsSelected)

  return (
    <>
      {isVisible && (
        <Box
          sx={{
            position: 'absolute',
            top: well.Top,
            left: well.Left,
            transform: 'translate(-50%, -100%)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Button
            ref={anchorRef}
            variant={well.IsSelected ? 'contained' : 'outlined'}
            color={well.IsSelected ? 'primary' : 'inherit'}
            size="small"
            onClick={handleSelect}
            onContextMenu={(e) => { e.preventDefault(); togglePopover(e) }}
            sx={{ minWidth: 0, p: 0.5, borderRadius: 2 }}
            aria-label={`Well ${well.Name}`}
            title={`Well ${well.Name} (right-click for info)`}
          >
            <RoomIcon fontSize="small" />
          </Button>
          <Box component="span" sx={{ fontWeight: 600, userSelect: 'none' }}>
            {well.Name}
          </Box>

          <PopoverWellInfo
            wellId={wellId}
            anchorEl={anchorRef.current}
            open={isOpen}
            onClose={() => dispatch(setOpenWellPopover(null))}
          />
        </Box>
      )}
    </>
  )
})

export default WellMarker

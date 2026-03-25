import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
import type { Theme } from '@mui/material/styles'
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

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
  /**
   * When set, the card is rendered in a portal with position:fixed so it is not clipped
   * by ancestors (e.g. map wrapper with overflow:hidden). Position follows this element
   * on scroll and resize.
   */
  anchorRef?: React.RefObject<HTMLElement | null>
  /** When using anchorRef (portal), wire these so hover can move from marker to card without closing. */
  portalPointerHandlers?: {
    onMouseEnter?: () => void
    onMouseLeave?: () => void
  }
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

/** Fixed viewport position so the card clears overflow:hidden ancestors (portal mode). */
function portalPlacementStyle(
  placement: WellInfoCardPlacement,
  rect: DOMRect,
): React.CSSProperties {
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const base: React.CSSProperties = {
    position: 'fixed',
    zIndex: 1300,
  }
  switch (placement) {
    case 'above':
      return {
        ...base,
        left: cx,
        top: rect.top,
        transform: 'translate(-50%, calc(-100% - 8px))',
      }
    case 'below':
      return {
        ...base,
        left: cx,
        top: rect.bottom,
        transform: 'translate(-50%, 8px)',
      }
    case 'left':
      return {
        ...base,
        left: rect.left,
        top: cy,
        transform: 'translate(calc(-100% - 8px), -50%)',
      }
    case 'right':
      return {
        ...base,
        left: rect.right,
        top: cy,
        transform: 'translate(8px, -50%)',
      }
  }
}

/** Don't start a card drag from embedded controls or table (text selection). */
function isWellCardDragTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false
  return !!target.closest(
    'button, a, input, textarea, select, [role="checkbox"], .MuiIconButton-root, .MuiCheckbox-root, label, table, .MuiTableCell-root, .MuiTableRow-root, .MuiTableHead-root, .MuiTableBody-root',
  )
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
  anchorRef,
  portalPointerHandlers,
}: WellInfoCardProps) {
  const [geologyExpanded, setGeologyExpanded] = useState(false)
  const [portalBoxStyle, setPortalBoxStyle] = useState<React.CSSProperties | null>(null)
  const [userPanOffset, setUserPanOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragSessionRef = useRef<{
    pointerId: number
    startClientX: number
    startClientY: number
    startOffX: number
    startOffY: number
  } | null>(null)

  const OFFSET_X = 14
  const OFFSET_Y = placement === 'above' || placement === 'below' ? -8 : 0

  const placementStyle = PLACEMENT_STYLES[placement]

  useLayoutEffect(() => {
    if (!open || !anchorRef?.current) {
      setPortalBoxStyle(null)
      return
    }
    const update = () => {
      if (!anchorRef?.current) return
      setPortalBoxStyle(
        portalPlacementStyle(placement, anchorRef.current.getBoundingClientRect()),
      )
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, placement, anchorRef])

  useEffect(() => {
    if (!open) setUserPanOffset({ x: 0, y: 0 })
  }, [open])

  useEffect(() => {
    setUserPanOffset({ x: 0, y: 0 })
  }, [well.Name])

  const basePositionSx: React.CSSProperties =
    anchorRef != null
      ? (portalBoxStyle ?? {
          position: 'fixed',
          zIndex: 1300,
          left: 0,
          top: 0,
          visibility: 'hidden',
        })
      : {
          position: 'absolute',
          top: top + OFFSET_Y,
          left: left + OFFSET_X,
          ...placementStyle,
          zIndex: 2,
        }

  const positionSx = { ...basePositionSx }
  if (typeof positionSx.left === 'number') positionSx.left += userPanOffset.x
  if (typeof positionSx.top === 'number') positionSx.top += userPanOffset.y

  const cardSx = {
    ...positionSx,
    display: open ? 'block' : 'none',
    width: 175, //box was not auto stretching to display children for some reason
    maxHeight: '70vh',
    overflowX: 'auto',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: (t: Theme) => `1px solid ${t.palette.divider}`,
    boxShadow: 3,
    borderRadius: 1.5,
    p: 1.25,
    pointerEvents: 'auto',
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: isDragging ? ('none' as const) : ('auto' as const),
    userSelect: isDragging ? ('none' as const) : ('auto' as const),
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !open) return
    if (isWellCardDragTarget(e.target)) return
    e.preventDefault()
    dragSessionRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startOffX: userPanOffset.x,
      startOffY: userPanOffset.y,
    }
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = dragSessionRef.current
    if (!session || e.pointerId !== session.pointerId) return
    e.preventDefault()
    const dx = e.clientX - session.startClientX
    const dy = e.clientY - session.startClientY
    setUserPanOffset({
      x: session.startOffX + dx,
      y: session.startOffY + dy,
    })
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = dragSessionRef.current
    if (!session || e.pointerId !== session.pointerId) return
    dragSessionRef.current = null
    setIsDragging(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
  }

  const card = (
    <Box
      aria-hidden={!open}
      sx={cardSx}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onMouseEnter={portalPointerHandlers?.onMouseEnter}
      onMouseLeave={() => {
        if (isDragging) return
        portalPointerHandlers?.onMouseLeave?.()
      }}
    >
      <Stack direction="row" spacing={1} sx={{ minWidth: 'min-content' }}>
        <Box sx={{ flexShrink: 0 }}>
          <Stack direction="row" alignItems="flex-start" spacing={0.5}>
            <Stack spacing={0.5}>
              <Row label="G" value={`${well.GroundElevationFt}`} />
              <Row label="S" value={`${well.StaticElevationFt}`} />
              <Row label="P" value={`${well.PumpingElevationFt}`} />
            </Stack>
            <IconButton
              size="small"
              onClick={() => setGeologyExpanded((e) => !e)}
              aria-label={geologyExpanded ? 'Hide Geology & Hydrology' : 'Show Geology & Hydrology'}
              sx={{ mt: -0.5, mr: 0.25 }}
            >
              {geologyExpanded ? (
                <CloseFullscreenIcon fontSize="small" />
              ) : (
                <OpenInFullIcon fontSize="small" />
              )}
            </IconButton>
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
          {/* <Box sx={{ mt: 1, opacity: 0.6 }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{well.Name}</Typography>
          </Box> */}
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

  if (anchorRef != null) {
    return open ? createPortal(card, document.body) : null
  }

  return card
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ fontWeight: 700, width: 16, textAlign: 'center' }}>{label}</Box>
      <Box sx={{ fontFamily: 'monospace' }}>{value}</Box>
    </Stack>
  )
}
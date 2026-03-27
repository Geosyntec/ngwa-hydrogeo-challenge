import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Box, IconButton, Typography, Divider, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const GAP_AFTER_HOST = 12;
const HELP_GAP_FROM_HOST = 6;
/** Approximate hit target width so the help chip clears the host edge without clipping. */
const HELP_STRIDE = 44;

type PanelCoords = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type HelpCoords = {
  top: number;
  left: number;
};

type RealityCheckProps = {
  title: string;
  open: boolean;
  onToggleDisplay: () => void;
  /** show the floating button only when the host panel is “available/open” */
  available?: boolean;
  /** width of the slide-out in px */
  width?: number;
  /** panel body */
  children: ReactNode;
};

/**
 * Help icon and (when open) the text panel are portaled to document.body with
 * position:fixed so accordion overflow cannot clip them. The panel sits to the
 * right of the question area with a fixed viewport height and scrollable body.
 */
export default function RealityCheck({
  title,
  open,
  onToggleDisplay,
  available = true,
  width = 360,
  children,
}: RealityCheckProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [helpPos, setHelpPos] = useState<HelpCoords | null>(null);
  const [panelCoords, setPanelCoords] = useState<PanelCoords | null>(null);

  useLayoutEffect(() => {
    if (!available) {
      setHelpPos(null);
      setPanelCoords(null);
      return;
    }
    const el = hostRef.current;
    if (!el) {
      setHelpPos(null);
      setPanelCoords(null);
      return;
    }
    const update = () => {
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const topPad = 12;
      const bottomPad = 12;

      // Help: just outside the host’s right edge (fully visible, not clipped)
      setHelpPos({
        top: Math.max(topPad, r.top + 8),
        left: r.right + HELP_GAP_FROM_HOST,
      });

      if (!open) {
        setPanelCoords(null);
        return;
      }

      // Panel: to the right of the host, after the help control band
      let panelLeft = r.right + HELP_STRIDE + GAP_AFTER_HOST;
      let panelW = Math.min(width, vw - panelLeft - 8);
      if (panelW < 200) {
        panelW = Math.min(width, vw - 16);
        panelLeft = Math.max(8, vw - panelW - 8);
      }
      const panelTop = Math.max(topPad, r.top);
      // Fixed height from viewport — does not grow when the page scrolls; body scrolls inside
      const panelHeight = Math.max(
        200,
        Math.min(640, vh - panelTop - bottomPad),
      );

      setPanelCoords({
        top: panelTop,
        left: panelLeft,
        width: panelW,
        height: panelHeight,
      });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, available, width]);

  const helpButton =
    available &&
    helpPos &&
    createPortal(
      <Tooltip title={open ? "Hide reality check" : "Show reality check"}>
        <IconButton
          color={open ? "primary" : "default"}
          // onClick={onToggleDisplay}
          size="small"
          sx={{
            position: "fixed",
            top: helpPos.top,
            left: helpPos.left,
            zIndex: 1301,
            bgcolor: open ? "primary.light" : "background.paper",
            boxShadow: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            pointerEvents: "auto",
            "&:hover": {
              bgcolor: open ? "primary.light" : "background.default",
            },
          }}
          aria-label="Reality check"
        >
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>,
      document.body,
    );

  const panel =
    open &&
    available &&
    panelCoords &&
    createPortal(
      <Box
        role="dialog"
        aria-label={`${title} (reality check)`}
        sx={{
          position: "fixed",
          zIndex: 1300,
          top: panelCoords.top,
          left: panelCoords.left,
          width: panelCoords.width,
          height: panelCoords.height,
          maxHeight: panelCoords.height,
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          border: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 1,
          boxShadow: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 1,
            flexShrink: 0,
          }}
        >
          <Typography variant="subtitle1" sx={{ flex: 1, fontWeight: 700 }}>
            {title}
          </Typography>
          <IconButton aria-label="Close" onClick={onToggleDisplay} size="small">
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Divider flexItem />
        <Box
          sx={{
            p: 2,
            flex: 1,
            minHeight: 0,
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          {children}
        </Box>
      </Box>,
      document.body,
    );

  return (
    <>
      <Box
        ref={hostRef}
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
        aria-hidden
      />
      {helpButton}
      {panel}
    </>
  );
}

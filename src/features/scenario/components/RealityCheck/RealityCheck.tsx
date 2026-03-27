import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Box, IconButton, Typography, Divider, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

type PanelCoords = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type RealityCheckProps = {
  title: string;
  open: boolean;
  onToggle: () => void;
  /** show the floating button only when the host panel is “available/open” */
  available?: boolean;
  /** width of the slide-out in px */
  width?: number;
  /** panel body */
  children: ReactNode;
};

/**
 * Help icon stays in the host (absolute on the panel’s right edge).
 * The text panel is portaled to document.body with position:fixed so it isn’t
 * clipped by accordion overflow. When closed, only the icon is shown.
 */
export default function RealityCheck({
  title,
  open,
  onToggle,
  available = true,
  width = 360,
  children,
}: RealityCheckProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [panelCoords, setPanelCoords] = useState<PanelCoords | null>(null);

  useLayoutEffect(() => {
    if (!open || !available) {
      setPanelCoords(null);
      return;
    }
    const el = hostRef.current;
    if (!el) {
      setPanelCoords(null);
      return;
    }
    const update = () => {
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const panelW = Math.min(width, r.width, 420, vw - 16);
      const left = Math.max(8, r.right - panelW);
      const top = r.top + 8;
      const maxH = Math.max(120, Math.min(r.height - 16, vh - top - 8));
      setPanelCoords({
        top,
        left,
        width: panelW,
        height: maxH,
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

  const panel = panelCoords && (
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
        maxHeight: `min(${panelCoords.height}px, calc(100vh - ${panelCoords.top + 8}px))`,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderLeft: (t) => `1px solid ${t.palette.divider}`,
        boxShadow: 3,
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", px: 2, py: 1, flexShrink: 0 }}>
        <Typography variant="subtitle1" sx={{ flex: 1, fontWeight: 700 }}>
          {title}
        </Typography>
        <IconButton aria-label="Close" onClick={onToggle} size="small">
          <CloseRoundedIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ p: 2, overflowY: "auto", flex: 1, minHeight: 0 }}>{children}</Box>
    </Box>
  );

  return (
    <>
      {/* Fills the positioned parent so we can align the portaled panel to this region */}
      <Box
        ref={hostRef}
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
        aria-hidden
      />

      {available && (
        <Tooltip title={open ? "Hide reality check" : "Show reality check"}>
          <IconButton
            color={open ? "primary" : "default"}
            onClick={onToggle}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: -18,
              transform: "translateX(50%)",
              bgcolor: open ? "primary.light" : "background.paper",
              boxShadow: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              zIndex: 3,
              pointerEvents: "auto",
              "&:hover": {
                bgcolor: open ? "primary.light" : "background.default",
              },
            }}
            aria-label="Reality check"
          >
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {open && available && panel && createPortal(panel, document.body)}
    </>
  );
}

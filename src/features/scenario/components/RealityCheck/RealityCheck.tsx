import { ReactNode } from "react";
import { Box, IconButton, Typography, Divider, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

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
 * Slide-out panel that attaches to the right side of whatever container you put it in.
 * Put the host container in position: 'relative' and overflow: 'visible'.
 * Mirrors the legacy `.reality-check` -> `.reality-check-tab` -> `.reality-check-panel` behavior.  [1](https://geosyntec-my.sharepoint.com/personal/aang_geosyntec_com/Documents/Microsoft%20Copilot%20Chat%20Files/scenario.html)
 */
export default function RealityCheck({
  title,
  open,
  onToggle,
  available = true,
  width = 360,
  children,
}: RealityCheckProps) {
  return (
    <>
      {/* Floating tab/button, positioned just outside the host panel’s right edge */}
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

      {/* Slide-out panel */}
      <Box
        role="dialog"
        aria-label={`${title} (reality check)`}
        sx={{
          position: "absolute",
          top: 8,
          right: 0,
          height: "calc(100% - 16px)",
          width,
          maxWidth: "min(92vw, 420px)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms ease",
          bgcolor: "background.paper",
          borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: 3,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", px: 2, py: 1 }}>
          <Typography variant="subtitle1" sx={{ flex: 1, fontWeight: 700 }}>
            {title}
          </Typography>
          <IconButton aria-label="Close" onClick={onToggle} size="small">
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 2, overflowY: "auto" }}>{children}</Box>
      </Box>
    </>
  );
}

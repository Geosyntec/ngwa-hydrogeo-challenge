import { Box } from "@mui/material";
import { resolvePublicAssetUrl } from "../../../../utils/publicAssetUrl";

/**
 * Filenames under `public/assets/img/` for each challenge accordion.
 * Add matching PNGs (or rename files to match) for icons to appear.
 */
export const PANEL_ACCORDION_ICON_FILES = {
  selectWells: "icn_select-wells.png",
  flowDirection: "icn_flow-direction.png",
  gradient: "icn_gradient.png",
  horizontalVelocity: "icn_horizontal-velocity.png",
} as const;

export type PanelAccordionIconKey = keyof typeof PANEL_ACCORDION_ICON_FILES;

type PanelAccordionIconProps = {
  panel: PanelAccordionIconKey;
};

/** Fixed slot for accordion header icons (decorative; section title carries the label). */
export function PanelAccordionIcon({ panel }: PanelAccordionIconProps) {
  const file = PANEL_ACCORDION_ICON_FILES[panel];
  const src = resolvePublicAssetUrl(`/assets/img/${file}`);
  return (
    <Box
      component="img"
      src={src}
      alt=""
      aria-hidden
      sx={{
        width: 40,
        height: 40,
        objectFit: "contain",
        flexShrink: 0,
        display: "block",
      }}
    />
  );
}

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

export type ScenarioInstructionItem = {
  primary: string;
  nestedItems?: string[];
};

/** Placeholder steps until scenario copy is finalized. */
const MAP_INSTRUCTIONS: ScenarioInstructionItem[] = [
  {
    primary:
      "Hovering over or clicking on a well will reveal an info card with the following components:",
    nestedItems: [
      "Elevation data (see below for more details)",
      "A checkbox to toggle groundwater pumping on/off",
      "A geology and hydrogeology table that can be displayed by clicking the 'Expand' icon in the top-right corner",
    ],
  },
  {
    primary:
      "Elevation data should be interpreted as follows (definitions appear when hovering over icons):",
    nestedItems: [
      "G: Ground elevation",
      "S: Water table elevation in static conditions",
      "P: Water table elevation in pumping conditions",
    ],
  },
  {
    primary:"Well info cards can be repositioned by dragging them around the map."
  }
];

export type ScenarioInfoModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ScenarioInfoModal({
  open,
  onClose,
}: ScenarioInfoModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>How to Use the Map</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Follow these steps to interpret well information and complete the
          challenge.{" "}
        </Typography>
        <List dense disablePadding component="ol" sx={{ pl: 2.5, m: 0 }}>
          {MAP_INSTRUCTIONS.map((item, index) => (
            <ListItem
              key={index}
              disableGutters
              sx={{
                display: "list-item",
                listStyleType: "decimal",
                flexDirection: "column",
                alignItems: "stretch",
                py: 0.5,
              }}
            >
              <ListItemText
                primary={item.primary}
                primaryTypographyProps={{ variant: "body2" }}
              />
              {item.nestedItems != null && item.nestedItems.length > 0 ? (
                <List dense disablePadding component="ul" sx={{ pl: 4, m: 0 }}>
                  {item.nestedItems.map((nested, nestedIndex) => (
                    <ListItem
                      key={nestedIndex}
                      disableGutters
                      sx={{
                        display: "list-item",
                        listStyleType: "disc",
                        py: 0.25,
                      }}
                    >
                      <ListItemText primary={nested}></ListItemText>
                    </ListItem>
                  ))}
                </List>
              ) : null}
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

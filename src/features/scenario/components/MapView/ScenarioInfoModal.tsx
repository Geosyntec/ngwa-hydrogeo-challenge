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
const PLACEHOLDER_INSTRUCTIONS: ScenarioInstructionItem[] = [
  {
    primary: "Instructions for this scenario will appear here.",
    nestedItems: [
      "Review the map and well locations.",
      "Complete each panel in order.",
    ],
  },
  {
    primary: "Additional guidance will be added in a future update.",
  },
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
      <DialogTitle>Scenario instructions</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Follow these steps to complete the challenge.
        </Typography>
        <List dense disablePadding component="ol" sx={{ pl: 2.5, m: 0 }}>
          {PLACEHOLDER_INSTRUCTIONS.map((item, index) => (
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
                <List
                  dense
                  disablePadding
                  component="ul"
                  sx={{
                    pl: 2.5,
                    m: 0,
                    mt: 0.5,
                    width: "100%",
                    listStyleType: "disc",
                  }}
                >
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
                      <ListItemText
                        primary={nested}
                        primaryTypographyProps={{ variant: "body2" }}
                      />
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

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

/** Placeholder steps until scenario copy is finalized. */
const PLACEHOLDER_INSTRUCTIONS: string[] = [
  "Instructions for this scenario will appear here.",
  "Additional guidance will be added in a future update.",
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
          {PLACEHOLDER_INSTRUCTIONS.map((text, index) => (
            <ListItem
              key={index}
              disableGutters
              sx={{ display: "list-item", listStyleType: "decimal", py: 0.5 }}
            >
              <ListItemText
                primary={text}
                primaryTypographyProps={{ variant: "body2" }}
              />
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

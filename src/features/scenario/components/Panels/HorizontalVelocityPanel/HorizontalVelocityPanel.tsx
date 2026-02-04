import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function HorizontalVelocityPanel() {
  return (
    <Accordion disabled>
      <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
        <Typography variant="subtitle1">Horizontal Velocity</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" color="text.secondary">
          (Locked until Gradient Step 2 is complete)
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}

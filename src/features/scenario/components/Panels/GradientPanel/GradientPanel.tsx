import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function GradientPanel() {
  return (
    <Accordion disabled>
      <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
        <Typography variant="subtitle1">Gradient</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" color="text.secondary">
          (Locked until Flow Direction Step 3 is complete)
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}

import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function FlowDirectionPanel() {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
        <Typography variant="subtitle1">Flow Direction</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" color="text.secondary">
          (Coming next: Step 1 / Step 2 / Step 3 UI, answer checking & solution reveal)
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}


import { Box, Typography, Container, Avatar, TextField, Grid} from "@mui/material";
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';


export default function Review(prop) {
  
  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          mt: 8,
          mb: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <AccessibilityNewIcon></AccessibilityNewIcon>
        </Avatar>

        <Typography variant="h5">Review </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>

          <Typography sx={{mt : 3, ml : "5%"}}> How far do you live from campus ?  </Typography>
            <Grid item xs={12}>

              <TextField
                autoFocus
                fullWidth
                required
                id="page1q1"
                name="page1q1"
                disabled
                placeholder={prop.questions.find(item => item["page1q1"]).page1q1[0]}
              />
            </Grid>

            <Typography sx={{mt : 3, ml : "5%"}}> What is your main method of transport to campus? </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page1q2"
                name="page1q2"
                placeholder={prop.questions.find(item => item["page1q2"]).page1q2[0]}
                disabled
   
              />
            </Grid>

            <Typography sx={{mt : 3, ml : "5%"}}> another question </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page1q3"
                name="page1q3"
                placeholder={prop.questions.find(item => item["page1q3"]).page1q3[0]}
                disabled
              />
            </Grid>
          </Grid>

          <Typography sx={{mt : 3, ml : "5%"}}> And what may be the last question? </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page1q4"
                name="page1q4"
                placeholder={prop.questions.find(item => item["page1q4"]).page1q4[0]}
                disabled
              />
            </Grid>

            <Typography sx={{mt : 3, ml : "5%"}}> what is your monthly electric bill?  </Typography>
            <Grid item xs={12}>

              <TextField
                autoFocus
                fullWidth
                required
                id="page2q1"
                name="page2q1"
                placeholder={prop.questions.find(item => item["page2q1"]).page2q1[0]}
                disabled
              />
            </Grid>

            <Typography sx={{mt : 3, ml : "5%"}}> what is your monthly gas bill? </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page2q2"
                name="page2q2"
                placeholder={prop.questions.find(item => item["page2q2"]).page2q2[0]}
                disabled
              />
            </Grid>

            <Typography sx={{mt : 3, ml : "5%"}}> what is your monthly oil bill? </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page2q3"
                name="what is your chosen mode of transport?"
                placeholder={prop.questions.find(item => item["page2q3"]).page2q3[0]}
              />
            </Grid>
          

          <Typography sx={{mt : 3, ml : "5%"}}> what is your yearly milage on your car? </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page2q4"
                name="if by vehicle, what is your average distance travelled weekly?"
                type="number"
                placeholder={prop.questions.find(item => item["page2q4"]).page2q4[0]}
              />
            </Grid>


            <Typography sx={{mt : 3, ml : "5%"}}> How many flights have you taken in the past year? </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page2q5"
                name="How many flights have you taken in the past year?"
                type="number"
                placeholder={prop.questions.find(item => item["page2q5"]).page2q5[0]}
              />
            </Grid>

            <Typography sx={{mt : 3, ml : "5%"}}> do you recyle news papers? 0 for No, 1 for Yes </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page2q6"
                name="How many flights have you taken in the past year?"
                type="number"
                placeholder={prop.questions.find(item => item["page2q6"]).page2q6[0]}
              />
            </Grid>

            <Typography sx={{mt : 3, ml : "5%"}}> do you recyle news aluminium? 0 for No, 1 for Yes </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page2q7"
                name="How many flights have you taken in the past year?"
                type="number"
                placeholder={prop.questions.find(item => item["page2q7"]).page2q7[0]}
              />
            </Grid>
          <br></br>     
        </Box>     
      </Box>
    </Container>
  );
}

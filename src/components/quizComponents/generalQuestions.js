import { Avatar, TextField, Grid } from "@mui/material";
import { Box, Typography, Container } from "@mui/material";
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { useCallback } from "react";

export default function GeneralQuestions({answer, onAnswer}) {

    const handleInputChange = useCallback(event => {
      let newAnswer = {[event.target.id] : [event.target.value, event.target.name]}
      onAnswer(answer => [...answer, newAnswer]);
    }, [onAnswer])
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          mb: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <AccessibilityNewIcon></AccessibilityNewIcon>
        </Avatar>

        <Typography variant="h5">General Questions </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>

            <Typography sx={{mt : 3, ml : "5%"}}> How far do you live from campus ?  </Typography>
            <Grid item xs={12}>

              <TextField
                autoFocus
                fullWidth
                required
                id="page1q1"
                name="How far do you live from campus ? "
                type="q1"
                onChange={handleInputChange} 
                value={answer}
              />
            </Grid>

            <Typography sx={{mt : 3, ml : "5%"}}> What is your main method of transport to campus? </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page1q2"
                name="What is your main method of transport to campus?"
                type="page1q2"
                onChange={handleInputChange} 
                
              />
            </Grid>

            <Typography sx={{mt : 3, ml : "5%"}}> another question </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page1q3"
                name="another question"
                type="q3"
                onChange={handleInputChange} 
                
              />
            </Grid>
          </Grid>

          <Typography sx={{mt : 3, ml : "5%"}}> And what may be the last question? </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page1q4"
                name="And what may be the last question?"
                type="q4"
                onChange={handleInputChange} 
              />
            </Grid>
          <br></br>
        </Box>
      </Box>
    </Container>
  );
}

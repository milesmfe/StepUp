import { Avatar, TextField, Grid } from "@mui/material";
import { Box, Typography, Container } from "@mui/material";
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { useCallback } from "react";

export default function CarbonFootPrint({answer, onAnswer}) {

  const handleInputChange = useCallback(event => {
    let newAnswer = {[event.target.id] : [event.target.value]}
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

        <Typography variant="h5">Calculating Your FootPrint </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>

            <Typography sx={{mt : 3, ml : "5%"}}> what is your monthly electric bill ?  </Typography>
            <Grid item xs={12}>

              <TextField
                type="number"
                autoFocus
                fullWidth
                required
                id="page2q1"
                onChange={handleInputChange} 
              />
            </Grid>


            <Typography sx={{mt : 3, ml : "5%"}}> what is your monthly gas bill? </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page2q2"
                type="number"
                onChange={handleInputChange} 
              />
            </Grid>

            <Typography sx={{mt : 3, ml : "5%"}}> what is your monthly oil bill? </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page2q3"
                type="number"
                onChange={handleInputChange} 
              />
            </Grid>
          </Grid>

          <Typography sx={{mt : 3, ml : "5%"}}> what is your yearly milage on your car? </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page2q4"
                type="number"
                onChange={handleInputChange} 
              />
            </Grid>

            <Typography sx={{mt : 3, ml : "5%"}}> How many flights have you taken in the past year? </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page2q5"
                type="number"
                onChange={handleInputChange} 
              />
            </Grid>

            <Typography sx={{mt : 3, ml : "5%"}}> do you recyle news papers? 0 for No, 1 for Yes </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page2q6"
                type="number"
                onChange={handleInputChange} 
                inputProps={{ maxLength: 1}}
                InputProps={{ maxLength: 1}}
              />
            </Grid>

            <Typography sx={{mt : 3, ml : "5%"}}> do you recyle news aluminium? 0 for No, 1 for Yes </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="page2q7"
                type="number"
                onChange={handleInputChange} 
                inputProps={{ maxLength: 1}}
                InputProps={{ maxLength: 1}}
              />
            </Grid>
          
          <br></br>
        
        </Box>
        
      </Box>
    </Container>
  );
}

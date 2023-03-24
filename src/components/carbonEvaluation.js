import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import GeneralQuestions from './quizComponents/generalQuestions';
import CarbonFootPrint from './quizComponents/carbonFootPrint';
import Review from './quizComponents/review';
import { useState } from 'react';
import { Button } from "@mui/material";
import { Container } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import CarbonSummary from './quizComponents/carbonSummary';
import { useLocation } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';


// different steps within the registration process
const steps = [
  'create account',
  'General',
  'Sustainabilty',
  'Review',
  'Emissions'
];

const breakpoints = [4,11,11,11];

function strava() {
  const redirectUrl = "http://localhost:3000/redirect"; //for testing purposes
  //const redirectUrl = "http://ecm2434-group-project.web.app/redirect"
  const scope = "activity:read_all";
  const client_id = "103170";

  const handleLogin = (e) => {
    window.location = `http://www.strava.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirectUrl}/exchange_token&approval_prompt=force&scope=${scope}`;
    console.log(window.location);
  };

  return (
    <div>
     {handleLogin()}
    </div>
  );
}

export default function CarbonEvaluation() {

  const location = useLocation();
  const [page, setPage] = useState(1);
  const [answers, setAnswers] = useState([]);
  const [validPage, setValidPage] = useState(0);
  const [error, setError] = useState(location.state ? location.state.error : undefined);
  const allAnswers = {
    answer : answers
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(false);
  };

  const action = (
    <React.Fragment>
      <Button color="error" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
    );

  function StravaButton(){ 
    return(
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
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mb: 4 }}
                onClick={() =>{strava()}}
              >
                Connect with Strava
              </Button>

            </Box>
          </Container>
    )
  }

  /**
   * used to toggle betwen stages within the quiz by changing state of page, to determine which form to render
   * also used to prevent user from progressing to next stage without the completeion of the current stage
   * @returns 
   */
  function NextButton(){
    return(
      <div>
        
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

              {validForm().length === breakpoints[validPage] ? (
                <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mb: 4 }}
                onClick={() =>{setPage(page + 1); setValidPage(validPage + 1);}}
              >
                continue
              </Button>

              ) : 
              <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mb: 4 }}
              disabled
            >
              continue
            </Button> }
            </Box>
          </Container>
      </div>
  
    ); 
  }

  /**
   * filters all answers, to the valid responses
   * @returns filtered list containing answers to form questions
   */
  function validForm(){
    const uniqueValues = [];
    const filteredList = [];
   
    let newList = answers.reverse();
    newList.forEach((item) => {

      for (const key in item) {

        if (uniqueValues.includes(key)) {
          continue;
        }
        else{
          uniqueValues.push(key);
          filteredList.push(item);
        } 
      }
    });
    return allAnswers.answer = filteredList;;
  }

  return (
    <div>
      {console.log(validForm())}

      {page === 1 ? (
          <GeneralQuestions questions={answers} onAnswer={setAnswers} />
      ) : ""}

      {page === 2 ? (
        <CarbonFootPrint questions={answers} onAnswer={setAnswers}/>
      ) : ""}

      {page === 3 ? (
        <Review questions={allAnswers.answer}/>      
        
      ) : ""}

      {page === 4 ? (
        <CarbonSummary questions={allAnswers.answer}/>
      ) : ""}

      {page  ===  5 ? (
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
              <CircularProgress size={"100px"} />
          </Box>

      </Container>
      ) : ""}

      {page < 4 ? (
        <NextButton  />
      ) : ""}

      {page === 4 ? (
        <StravaButton />
      ) : ""}

      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={handleClose}
        action={action}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}> Invalid Inputs, Only numbers allowed !</Alert>
      </Snackbar>
      

      <Box sx={{ width: '100%', mb : 4}}>
          <Stepper activeStep={page} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

    </div>
   
  );
}
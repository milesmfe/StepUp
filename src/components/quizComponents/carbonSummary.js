import React from 'react'
import Box from '@mui/material/Box';
import { Typography } from "@mui/material";
import {writeUserEmissions} from '../../database';
import { Container } from "@mui/material";
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import { useAuth } from '../../util/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';


export default function CarbonSummary(prop) {
  console.log(prop)
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  let electricBill = Number(prop.questions.find(item => item["page2q1"]).page2q1[0]);
  let gasBill = Number(prop.questions.find(item => item["page2q2"]).page2q2[0]);
  let oilBill = Number(prop.questions.find(item => item["page2q3"]).page2q3[0]);
  let carYearMillage = Number(prop.questions.find(item => item["page2q4"]).page2q4[0]);
  let yearlyFLights =  Number(prop.questions.find(item => item["page2q5"]).page2q5[0]);
  let recycleNewsPaper = Number(prop.questions.find(item => item["page2q6"]).page2q6[0]); 
  let recycleAluminium = Number(prop.questions.find(item => item["page2q7"]).page2q7[0]);

  const emissions = (electricBill * 105) + (gasBill * 105) + (oilBill * 113) + (carYearMillage * .79) + (yearlyFLights * 2,200) + (recycleAluminium * 184) + (recycleNewsPaper * 166);

  console.log(emissions);
  isNaN(emissions) ?  navigate("/evaluation") : writeUserEmissions(currentUser.uid, emissions);
  
  return (
    <div>
      
    <Container component="main" maxWidth="lg" size="lg" >
      <Box
        sx={{
          mt: 8,
          mb: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
         <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="https://art.art/wp-content/uploads/previews/1/12511.jpg"
          alt="green iguana"
        />
        <CardContent>
        <Typography gutterBottom variant="h5" component="div">
              Your Carbon FootPrint
            </Typography>
            <Typography variant="body2" color="text.secondary">
              your state estimated carbon footprint is  <span style={{ fontWeight: 'bold' }}>{emissions} </span> kg of C02 per year, 
              lets think about how we can reduce this !

              <br></br>
              Connect with strava to start earning points and fighting against climate
              change!
            </Typography>

        </CardContent>
      </CardActionArea>
    </Card>


      </Box>
      </Container>
    </div>
    
    
  )
}

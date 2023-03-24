import React from 'react';
import { Button } from '@mui/material';
import { Box } from "@mui/system";
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { connectSrava } from '../../strava';

/*
function useWindowPosition(id) {
  const [animation, setAnimation] = useState(false);

  useLayoutEffect(() => {
    function updatePosition() {
      const offetSetHeight = window.document.getElementById(id).offsetHeight;
      if (window.pageYOffset > offetSetHeight * 0.7) {
        setAnimation(true);
      }
    }
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, [id]);
  return animation;
}
//
*/


export default function PageConnection () {

  return (
    <div id="connect-to-strava">
      <Box  maxWidth="lg" sx={{  display: 'flex',  justifyContent: 'center', alignItems: 'center', backgroundColor: "#121212",minHeight: '100vh',}}>
        <Stack spacing={2}>

          <Card sx={{ maxWidth: 345 }} onClick={console.log("hi")}>
                    <CardMedia
                    component="img"
                    height="300"
                    image="https://img.freepik.com/free-vector/hand-drawn-flat-design-digital-detox-illustration_23-2149321039.jpg?w=826&t=st=1679536194~exp=1679536794~hmac=e198d5392df2d78b1d7a398dc314f9836fb41cd11bea6afdd2246f3e8f3e0f3f"
                    alt="green iguana"
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Why Strava ? 
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Using strava will allow us to acquire essentially walking data, letting you monitor
                        your sustainability progression and your carbon footprint !
                    </Typography>
                    </CardContent>
            </Card>

            <Button variant='contained' onClick={() => connectSrava()}>Connect</Button>
            
        </Stack>

      </Box>
                

    </div>
  );
}
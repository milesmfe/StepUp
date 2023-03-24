import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import { Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link as Scroll } from 'react-scroll';
import { Typography } from '@mui/material';
import { Container } from "@mui/system";
import Box from '@mui/material/Box';



export default function InitialSplashPage() {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setChecked(true);
  }, []);
  return (
      <div id="header">
        <Container  maxWidth="xs" sx={{  display: 'flex',  justifyContent: 'center', alignItems: 'center', height: '100vh', }}>
        <Collapse
          in={checked}
          {...(checked ? { timeout: 1000 } : {})}
          collapsedSize={50}
        >
          <Box sx={{textAlign: 'center',}}>
            <Typography variant='h3' sx={{color: '#fff', fontSize: '4.5rem'}}>
                  Connect With
              </Typography>
              <Typography variant='h3' sx={{color: '#007d69', fontSize: '4.5rem'}}>
                 Strava
              </Typography>
              <Typography  sx={{color: '#fff',}}>
                 and start earning points right now!
              </Typography>

              
              <Scroll to="connect-to-strava" smooth={true}>
                <IconButton>
                  <ExpandMoreIcon sx={{color: '#007d69',fontSize: '4rem'}} />
                </IconButton>
              </Scroll>
          </Box>
        </Collapse>
      </Container> 
      </div>
  );
}
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import InitialSplashPage from './components/StravaSplashPage/intialSplashPage';
import { Button, Container, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import ConnectPage from './components/StravaSplashPage/connectPage';
import { Box } from "@mui/system";

const {
  REACT_APP_STRAVA_CLIENT_ID,
  REACT_APP_STRAVA_CLIENT_SECRET,
  REACT_APP_STRAVA_ACTIVITY_SCOPE,
  REACT_APP_STRAVA_DEVELOPMENT_REDIRECT_URL,
  REACT_APP_STRAVA_BUILD_REDIRECT_URL,
  REACT_APP_STRAVA_AUTH_URL,
  REACT_APP_STRAVA_ACTIVITIES_URL,
  REACT_APP_STRAVA_TOKEN_URL,
  NODE_ENV,
} = process.env;


const DEVELOPMENT = NODE_ENV === "development";
const REACT_APP_STRAVA_REDIRECT_URL = DEVELOPMENT
  ? REACT_APP_STRAVA_DEVELOPMENT_REDIRECT_URL
  : REACT_APP_STRAVA_BUILD_REDIRECT_URL;

  /**
   * Connects a user's Strava account.
   */
export function connectSrava() {
  const urlParams = new URLSearchParams({
    client_id: REACT_APP_STRAVA_CLIENT_ID,
    response_type: "code",
    redirect_uri: `${REACT_APP_STRAVA_REDIRECT_URL}`,
    approval_prompt: "force",
    scope: REACT_APP_STRAVA_ACTIVITY_SCOPE,
  }).toString();
  window.location = `${REACT_APP_STRAVA_AUTH_URL}?${urlParams}`;
}

/**
 * Gets a user's activities from Strava.
 * 
 * @returns False if it was unsuccessful, otherwise returns True.
 */
export async function getActivities() {
  const STRAVA_ACCESS_TOKEN = localStorage.getItem("STRAVA_ACCESS_TOKEN");
  if (STRAVA_ACCESS_TOKEN) {
    const urlParams = {
      headers: {
        Authorization: `Bearer ${STRAVA_ACCESS_TOKEN}`,
      },
    };
    return axios
      .get(REACT_APP_STRAVA_ACTIVITIES_URL, urlParams)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  } else {
    return false;
  }
}

/**
 * Disconnects from Strava once the process is complete.
 */
export function disconnectStrava() {
  localStorage.removeItem("STRAVA_ACCESS_TOKEN");
}

export  function Strava() {

  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const STRAVA_ACCESS_TOKEN = localStorage.getItem("STRAVA_ACCESS_TOKEN");
  const USER_CODE = searchParams.get("code");
  const ERROR = searchParams.get("error");

  async function getAccessToken() {
    const urlParams = {
      client_id: REACT_APP_STRAVA_CLIENT_ID,
      client_secret: REACT_APP_STRAVA_CLIENT_SECRET,
      code: USER_CODE,
      grant_type: "authorization_code",
    };
    axios
      .post(REACT_APP_STRAVA_TOKEN_URL, urlParams)
      .then((res) => {
        const token = res.data.access_token;
        if (token) {
          localStorage.setItem("STRAVA_ACCESS_TOKEN", token);
          setLoading(false);
        }
        console.log(token);
      })
      .catch((err) => console.log(err.response));
  }
  
  // Check if the user arrived here manually
  useEffect(() => {
    if (!USER_CODE) setLoading(false);
  }, [USER_CODE]);

  if (USER_CODE && !STRAVA_ACCESS_TOKEN) {
    getAccessToken();
  }
  if (!loading)
  return (
    <Container maxWidth="xxl" sx={{backgroundColor: "#121212"}}>
        {ERROR === "access_denied" ? (
          <>
            <Typography variant="h3">Request Cancelled</Typography>
            <Typography variant="h5">
              Would you still like to connect?
            </Typography>
            <Button onClick={() => connectSrava()}>Connect</Button>
          </>
        ) : !USER_CODE && !STRAVA_ACCESS_TOKEN ? (
          <>
            
              <Box sx={{
                  minHeight: '100vh',
                  backgroundColor: "#121212",
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                }}>
                <CssBaseline />
                <InitialSplashPage />
                <ConnectPage />       
              </Box>
          </>
        ) : !STRAVA_ACCESS_TOKEN ? (
          <>
            <Typography variant="h3">Failed to connect Strava</Typography>
            <Button href="/">Home</Button>
            <Button onClick={() => connectSrava()}>Try again?</Button>
          </>
        ) : (
          <Navigate to="/" />
        )}
      </Container>
    
  );
}
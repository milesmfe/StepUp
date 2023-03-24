// imports
import React, { useRef, useState } from "react";
import { Avatar, Button, TextField, Link, Grid } from "@mui/material";
import { Box, Alert, Typography, Container, Stack } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginIcon from "@mui/icons-material/Login";
import { useAuth } from "../util/AuthContext";

/**
 * Enable the user to login.
 */
export default function Login() {
  const { loginWithGithub, loginWithGoogle, loginWithFacebook } = useAuth();
  const { login, warning, message } = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    // if email or password are missing from form submission
    if (!email || !password) {
      // notify the user
      return setError("Some fields were left blank");
    }

    // attempt to login with the given details
    try {
      setError("");
      setLoading(true);
      await login(email, password);
    // if this is not possible
    } catch (err) {
      // tell the user why login failed
      // with custom error message for each error code
      switch (err.code) {
        case "auth/invalid-email":
          setError("Invalid email");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/user-not-found":
          setError("User does not exist");
          break;
        case "auth/too-many-requests":
          setError("Account temporarily disabled");
          break;
        default:
          setError("Login failed");
          break;
      }
      // Send full error message to console
      console.log(err); 
    }
    setLoading(false);
  }

  /**
   * Handles a login using GitHub account.
   */
  async function handleGithub() {
    // attempts to login using GitHub
    try {
      setError("");
      setLoading(true);
      await loginWithGithub();
    // if this fails
    } catch (err) {
      // notify the user
      setError("Login failed");
      // Send full error message to console
      console.log(err); 
    }
    setLoading(false);
  }

  /**
   * Handles a login using Google account.
   */
  async function handleGoogle() {
    // attempts to login using Google
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
    // if this fails
    } catch (err) {
      // notify the user
      setError("Login failed");
      // Send full error message to console
      console.log(err);
    }
    setLoading(false);
  }

  /**
   * Handles a login using Facebook account.
   */
  async function handleFacebook() {
    // attempts to login using Facebook
    try {
      setError("");
      setLoading(true);
      await loginWithFacebook();
    // if this fails
    } catch (err) {
      // notify the user
      setError("Login failed");
      // Send full error message to console
      console.log(err);
    }
    setLoading(false);
  }

  // display the login form
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
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">Login</Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                inputRef={emailRef}
                autoFocus
                fullWidth
                required
                autoComplete="email"
                label="Email Address"
                name="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                inputRef={passwordRef}
                fullWidth
                required
                autoComplete="new-password"
                label="Password"
                name="password"
                type="password"
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            disabled={loading}
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log in
          </Button>

          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/register" variant="body2">
                Don't have an account? Register
              </Link>
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/reset" variant="body2">
                Forgot password? Reset
              </Link>
            </Grid>
          </Grid>

          <br></br>
          <hr></hr>
          <Stack direction="row">
            <Button
              variant="outlined"
              onClick={handleGithub}
              fullWidth
              sx={{ mt: 3 }}
              startIcon={<LoginIcon />}
            >
              Github
            </Button>
          </Stack>
          <Stack direction="row">
            <Button
              variant="outlined"
              onClick={handleGoogle}
              fullWidth
              sx={{ mt: 3 }}
              startIcon={<LoginIcon />}
            >
              google
            </Button>
          </Stack>
          <Stack direction="row">
            <Button
              variant="outlined"
              onClick={handleFacebook}
              fullWidth
              sx={{ mt: 3 }}
              startIcon={<LoginIcon />}
            >
              Facebook
            </Button>
          </Stack>
        </Box>
        <Box mt={6}>
          {error && (
            <Alert sx={{ mb: 1 }} variant="outlined" severity="warning">
              {error}
            </Alert>
          )}
          {warning && (
            <Alert sx={{ mb: 1 }} variant="outlined" severity="warning">
              {warning}
            </Alert>
          )}
          {message && (
            <Alert variant="outlined" severity="success">
              {message}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}

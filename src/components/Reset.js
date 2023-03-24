//imports
import React, { useRef, useState } from "react";
import { Avatar, Button, TextField, Link, Grid } from "@mui/material";
import { Box, Alert, Typography, Container } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../util/AuthContext";

/**
 * Password reset function
 */
export default function Reset() {
  const { resetPassword, warning, message } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Handles the submission of the Register form.
   * 
   * @param {*} e Submission of inputs.
   * @returns Any errors on invalid inputs. 
   */
  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;

    // if there is no email currently referenced
    if (!email) {
      // alert the user
      return setError("Email not provided");
    }

    // attempt to send a password reset email
    try {
      setError("");
      setLoading(true);
      await resetPassword(email);
      // and then navigate to the login page
      navigate("/login");
      alert('Password reset e-mail has been sent, please check your inbox.');
    // if this fails
    } catch (err) {
      // give responses for the possible reasons
      switch (err.code) {
        case "auth/invalid-email":
          // alert user
          setError("Invalid email");
          break;
        default:
          // alert user
          setError("Failed send password reset link");
          break;
      }
      // Send full error message to console
      console.log(err); 
    }
    setLoading(false);
  }

  // display the password reset form
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
        <Typography variant="h5">Reset Password</Typography>
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
          </Grid>
          <Button
            fullWidth
            disabled={loading}
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Reset Link
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/login" variant="body2">
                Back to Login
              </Link>
            </Grid>
          </Grid>
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

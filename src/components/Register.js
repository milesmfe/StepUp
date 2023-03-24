import React, { useRef, useState } from "react";
import { Avatar, Button, TextField, Link, Grid } from "@mui/material";
import { Box, Alert, Typography, Container } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../util/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Handles user registration
 */
export default function Register() {
  const { register, warning, message } = useAuth();
  const navigate = useNavigate();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Handles the submission of the registration form.
   * @param {*} e Submission of inputs.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    // retrieve the inputs from the form
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    // if any field was not filled
    if (!firstName || !lastName || !email || !password) {
      // alert the user
      return setError("Some fields were left blank");
    }

    // if either name contains numbers
    if(containsNumbers(firstName) || containsNumbers(lastName)){
      // alert the user
      return setError("Names cannot contain numbers");
    }

    // if either name contains special characters
    if(containsSpecials(firstName) || containsSpecials(lastName)){
      // alert the user
      return setError("Names cannot special characters");
    }

    // if the password is too short
    if(String(password).length < 9){
      // alert the user
      return setError("Password too short");
    }

    // if the password does not contain a number
    if(!containsNumbers(password)){
      // alert the user
      return setError("Password must contain at least one number");
    }

    // if the password does not contain special characters
    if(!containsSpecials(password)){
      // alert the user
      return setError("Password must contain at least one special character from: ( ~ ! @ # $ £ % ^ * - _ = + [ { ] } / ; : , . ? )");
    }

    // if the password does not contain both upper and lower case characters
    if(!containsUppercase(password) || !containsLowercase(password)){
      // alert the user
      return setError("Password must contain both uppercase and lowercase letters");
    }

    // attempt to register an account with given details
    try {
      setError("");
      setLoading(true);
      await register(email, password, firstName, lastName);
      // upon registration, redirect user to login page
      navigate("/login");
    // if there was a problem registering
    } catch (err) {
      // alert the user with a custom error message
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Account already registered with this email");
          break;
        case "auth/invalid-email":
          setError("Invalid email");
          break;
        default:
          setError("Failed to create account");
          break;
      }
      // Send full error message to console
      console.log(err); 
    }
    setLoading(false);
  }

  // display the registration form
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
        <Typography variant="h5">Register</Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                inputRef={firstNameRef}
                autoFocus
                fullWidth
                required
                autoComplete="given-name"
                label="First Name"
                name="firstName"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                inputRef={lastNameRef}
                fullWidth
                required
                autoComplete="family-name"
                label="Last Name"
                name="lastName"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                inputRef={emailRef}
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
            Register
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account?
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

/**
 * Checks whether a string contains numbers or not.
 * 
 * @param {*} str The string being searched.
 * @returns returns true if there exists a number within the string. Otherwise returns false.
 */
export function containsNumbers(str){
  var numbers = "1234567890";
  for(let i = 0; i < 10; i++){
    if(String(str).includes(numbers[i])){
      return true;
    }
  }
  return false;
}

/**
 * Checks whether a string contains lowercase letters or not.
 * 
 * @param {*} str The string being searched.
 * @returns returns true if there exists a lowercase letter within the string. Otherwise returns false.
 */
export function containsLowercase(str){
  var letters = "abcdefghijklmnopqrstuvwxyz";
  for(let i = 0; i < 26; i++){
    if(String(str).includes(letters[i])){
      return true;
    }
  }
  return false;
}

/**
 * Checks whether a string contains uppercase letters or not.
 * 
 * @param {*} str The string being searched.
 * @returns returns true if there exists a uppercase letter within the string. Otherwise returns false.
 */
export function containsUppercase(str){
  var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(let i = 0; i < 26; i++){
    if(String(str).includes(letters[i])){
      return true;
    }
  }
  return false;
}

/**
 * 
 * @param {*} str The string being searched.
 * @returns returns true if there exists a special character within the string. Otherwise returns false.
 */
export function containsSpecials(str){
  var letters = "(~!@#$£%^*-_=+[{]}/;:,.?)";
  for(let i = 0; i < 25; i++){
    if(String(str).includes(letters[i])){
      return true;
    }
  }
  return false;
}

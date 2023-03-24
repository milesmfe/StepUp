//imports
import React, { useState } from "react";
import { Button, TextField, Link, Grid } from "@mui/material";
import { Box, Typography, Container } from "@mui/material";
import { useAuth } from "../util/AuthContext";
import { readProfileData, writeProfileDetails } from "../database";
import CircularProgress from "@mui/material/CircularProgress";
import { CssBaseline } from "@mui/material";

var fname;
var lname;
var uname;
var profile;

export function unpackData(data){
    profile = data;
    fname = data.firstName;
    lname = data.lastName;
    uname = data.username;
}

export function repackData(uid){
    profile.firstName = fname;
    profile.lastName = lname;
    profile.username = uname;
    writeProfileDetails(uid, profile);
}


/**
 * allows the user to change their data.
 * 
 * @returns The page.
 */
export default function Settings () {

    const { currentUser } = useAuth();
    const [state, setState] = useState(false);

    // read and process user data
    readProfileData(currentUser.uid).then((res) => {
      unpackData(res);
      setState(true);
    });
    if(state){
        return(
            <Box
            sx={{
            mt: 8,
            mb: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            }}
        >
            <Typography variant="h5">Settings</Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <TextField
                    id="fname"
                    autoFocus
                    fullWidth
                    required
                    autoComplete="fname"
                    label={fname}
                    name="fname"
                />
                </Grid>
            </Grid>
            <Button
                onClick={() => {
                    fname = document.getElementById('fname').value;
                    repackData(currentUser.uid);
                }}
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Change your first name
            </Button>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                <TextField
                    id="lname"
                    autoFocus
                    fullWidth
                    required
                    autoComplete="lname"
                    label={lname}
                    name="lname"
                />
                </Grid>
            </Grid>
            <Button
                onClick={() => {
                    lname = document.getElementById('lname').value;
                    repackData(currentUser.uid);
                }}
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Change your last name
            </Button>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                <TextField
                    id="uname"
                    autoFocus
                    fullWidth
                    required
                    autoComplete="uname"
                    label={uname}
                    name="uname"
                />
                </Grid>
            </Grid>
            <Button
                onClick={() => {
                    uname = document.getElementById('uname').value;
                    repackData(currentUser.uid);
                }}
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Change your username
            </Button>

            <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                href = "/reset"
            >
                Reset your password
            </Button>

            
            <Grid container justifyContent="center">
                <Grid item>
                <Link href="/" variant="body2">
                    Back to your Profile
                </Link>
                </Grid>
            </Grid>
            </Box>
            
            </Box>
        );
}else {
    return (
        <div className="Settings">
          <Container
            component="main"
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CssBaseline />
            <CircularProgress />
          </Container>
        </div>
      );
}
}

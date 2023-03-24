//imports
import React from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/system";

/**
 * Produces a nice 404 error page
 * and allows the user to navigate away from 
 * the unfound page, to various available pages.
 */
export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h1">404</Typography>
        <Typography variant="h3">Page not Found</Typography>
        <Typography mt={1} variant="h6">
          Unfortunately, the page you're looking for does not exist.
        </Typography>
        <Typography mb={3} variant="h6">
          But here are some useful links:
        </Typography>
        <Stack direction="row" spacing={2} whiteSpace="nowrap">
          <Button sx={{ width: "100%" }} onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button sx={{ width: "100%" }} onClick={() => navigate("/")}>
            Home
          </Button>
          <Button sx={{ width: "100%" }} onClick={() => navigate("/login")}>
            Login
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

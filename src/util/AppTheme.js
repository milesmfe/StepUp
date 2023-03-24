// import required function
import { createTheme } from "@mui/material/styles";

// set the used fonts
const fonts = ["'Outfit'", "sans-serif"];

// create a theme
const AppTheme = createTheme({
  // set up theme colours
  palette: {
    mode: "dark",
    primary: {
      main: "#007d69",
      light: "#00dca5",
      dark: "#003c3c",
    },
  },
  // set up font weighting
  typography: {
    fontFamily: fonts.join(","),
    h1: {
      fontWeight: 900,
    },
    h2: {
      fontWeight: 900,
    },
    h3: {
      fontWeight: 800,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 300,
    },
  },
});

// export the theme
export default AppTheme;

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { AuthProvider } from "./util/AuthContext";
import { CssBaseline } from "@mui/material";
import { AuthOnly, NoAuthOnly } from "./util/PrivateRoute";
import AppTheme from "./util/AppTheme";
//
// Routes imports ------------------------------ //
import Register from "./components/Register";
import Login from "./components/Login";
import Reset from "./components/Reset";
import Settings from "./components/Settings";
import Leaderboard from "./components/Leaderboard";
import NotFound from "./components/NotFound";
import AppLayout from "./util/AppLayout";
import Garden from "./components/Garden/Garden";
import Profile from "./components/Profile/Profile";
import { Strava } from "./strava";
import CarbonEvaluation from "./components/carbonEvaluation";
// --------------------------------------------- //

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<AuthOnly><Profile /></AuthOnly>} />
            <Route path="/garden" element={<AuthOnly><Garden /></AuthOnly>} />
            <Route path="/strava" element={<AuthOnly><Strava /></AuthOnly>} />
            <Route path="/login" element={<NoAuthOnly><Login /></NoAuthOnly>} />
            <Route path="/register" element={<NoAuthOnly><Register /></NoAuthOnly>} />
            <Route path="/evaluation" element={ <AuthOnly><CarbonEvaluation /></AuthOnly> }/>
            <Route path="/reset" element={<Reset />} />
            <Route path="/settings" element={ <AuthOnly><Settings /></AuthOnly> }/>
            <Route path="/leaderboard" element={<AuthOnly><Leaderboard /></AuthOnly>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

/**
 * Render with global theme.
 */

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={AppTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);

// imports
import React from "react";
import { Container } from "@mui/system";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { CssBaseline } from "@mui/material";
import { useState } from "react";
import { readUsers } from "../database";

var userScores = [];
var runAlready = false;
var finished = false;

/**
 * Process the users' data for display on leaderboard
 * @param {*} data The users data as a JSON
 */
export function processUserData(data) {
  if (!runAlready) {
    const keys = Object.keys(data);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      if ("profile" in data[key] && "garden" in data[key]) {
        if ("username" in data[key].profile && "points" in data[key].garden) {
          if (data[key].profile.visible) {
            const user = data[key].profile.username;
            const points = data[key].garden.points;
            userScores.push([user, points]);
          }
        }
      }
    }
    // sort the user scores
    userScores.sort((a, b) => b[1] - a[1]);
    // update variables
    runAlready = true;
    finished = true;
    // log scores to console
    console.log(userScores);
    return userScores;
  }
}

/**
 * Produces a leaderboard page.
 */
export default function Leaderboard() {
  const [state, setState] = useState(false);

  // read and process user data
  readUsers().then((res) => {
    processUserData(res);
    setState(true);
  });
  // log details to the console
  console.log("finished");
  console.log(finished);
  console.log("scores");
  console.log(userScores);
  console.log(userScores.length);
  if (state) {
    // display the leaderboard
    return (
      <div className="Leaderboard">
        <Container component="main">
          <CssBaseline />
          <TableContainer
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell align="right">Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userScores.map((row) => (
                  <TableRow
                    key={row[0]}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row[0]}
                    </TableCell>
                    <TableCell align="right">{row[1]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </div>
    );
  } else {
    return (
      <div className="Leaderboard">
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

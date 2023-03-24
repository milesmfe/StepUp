import { AutoAwesome, LocalFloristSharp, Whatshot } from "@mui/icons-material";
import { Avatar, Badge, Box, Chip, Grid, Typography } from "@mui/material";
import ActivityTimeline from "./ActivityTimeline";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { readFormattedGardenData, readProfileData } from "../../database";
import { useAuth } from "../../util/AuthContext";
import Maps from "../Maps";

export default function Profile() {
  const { currentUser, profileData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [gardenData, setGardenData] = useState();
  const [activityData, setActivityData] = useState();

  useEffect(() => {
    const garden = readFormattedGardenData(currentUser.uid).then((res) => {
      setGardenData(res);
    });
    const profile = readProfileData(currentUser.uid).then((res) => {
      setActivityData(res.activity);
    });
    Promise.all([garden, profile]).then(() => {
      setLoading(false);
    });
  }, [currentUser]);

  if (!loading)
    return (
      <Box
        sx={{
          mb: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box
          component="img"
          width="100%"
          height="30vh"
          mb={-4}
          alt="Backdrop"
          src="/images/profile/backdrop.png"
          style={{ objectFit: "cover" }}
        />
        <Container component="main" maxWidth="xs">
          <Box mb={1}>
            <Badge
              color="success"
              overlap="circular"
              badgeContent=" "
              variant="dot"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <Avatar
                src={profileData.photoURL}
                alt={profileData.username}
                sx={{ width: 75, height: 75 }}
              />
            </Badge>
          </Box>
          <Typography variant="h5">{profileData.username}</Typography>
          <Typography variant="body1">{currentUser.email}</Typography>
          <Grid container spacing={2} mt={0} justifyContent="center">
            <Grid item>
              <Chip
                variant="filled"
                icon={<AutoAwesome />}
                label={gardenData.level}
                color="default"
              />
            </Grid>
            <Grid item>
              <Chip
                variant="filled"
                icon={<LocalFloristSharp />}
                label={gardenData.points}
                color="success"
              />
            </Grid>
            <Grid item>
              <Chip
                variant="filled"
                icon={<Whatshot />}
                label={gardenData.streak}
                color="warning"
              />
            </Grid>
          </Grid>
        </Container>
        <Typography mt={3} variant="h4">
          Recent Activity
        </Typography>
        <Maps/>
        <ActivityTimeline activityData={activityData} />
      </Box>
    );
}

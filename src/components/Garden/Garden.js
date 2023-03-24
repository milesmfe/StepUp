import React, { useEffect, useState } from "react";
import { Container } from "@mui/system";
import { green, grey, orange } from "@mui/material/colors";
import { Avatar, Zoom, CircularProgress, Button } from "@mui/material";
import { SwipeableDrawer, Tooltip, Typography } from "@mui/material";
import { List, Paper, Stack, Box, Chip } from "@mui/material";
import { CheckCircle, CloudUpload } from "@mui/icons-material";
import { LocalFloristSharp } from "@mui/icons-material";
import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import { addUserActivity, writeGardenData } from "../../database";
import { giveUserFlowerCardList } from "../../database";
import { readFormattedGardenData } from "../../database";
import { useAuth } from "../../util/AuthContext";
import { getActivities } from "../../strava";
import GardenRender from "./GardenRender";
import FlowerCard from "./FlowerCard";
import Puller from "./Puller";

export default function Garden() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [points, setPoints] = useState();
  const [streak, setStreak] = useState();
  const [level, setLevel] = useState();
  const [seeds, setSeeds] = useState();
  const [planted, setPlanted] = useState();
  const [size, setSize] = useState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [flowerOpenData, setFlowerOpenData] = useState(null);
  const [flowerOpen, setFlowerOpen] = useState(false);
  const [checkingCompletion, setCheckingCompletion] = useState(false);
  const toggleDrawer = (newOpen) => () => setDrawerOpen(newOpen);
  const stravaConnected = localStorage.getItem("STRAVA_ACCESS_TOKEN");
  const [changes, setChanges] = useState();
  const drawerBleed = 70;

  // Autosave hook
  useEffect(() => {
    if (!loading) {
      // Check if user needs more seeds
      const inProgress = planted.find((v) => v.progress < v.reward);
      if (!inProgress && seeds.length === 0) {
        const compoundLevel = [...Array(level + 1).keys()];
        Promise.all(
          compoundLevel.map(
            async (v) =>
              await giveUserFlowerCardList(currentUser.uid, `lvl${v}`)
          )
        ).then(async () => {
          const data = await readFormattedGardenData(currentUser.uid, true);
          setSeeds(data.seeds);
        });
      }
      setSaving(true);
      writeGardenData(currentUser.uid, {
        points: points,
        streak: streak,
        level: level,
        seeds: seeds,
        planted: planted,
        gardenSize: size,
      });
      setTimeout(() => {
        setSaving(false);
      }, 1000);
    }
  }, [
    points,
    streak,
    level,
    seeds,
    planted,
    size,
    changes,
    currentUser,
    loading,
  ]);

  // Data fetch hook
  useEffect(() => {
    setLoading(true);
    readFormattedGardenData(currentUser.uid, true).then((data) => {
      setPoints(data.points);
      setStreak(data.streak);
      setLevel(data.level);
      setSeeds(data.seeds);
      setPlanted(data.planted);
      setSize(data.gardenSize);
      setLoading(false);
    });
  }, [currentUser]);

  function getRandomInRange(from, to) {
    return (Math.random() * (to - from) + from).toFixed(0) * 1;
  }

  function plantSeed(id) {
    let newPlanted = planted;
    let newWidth = size.width;
    let newHeight = size.height;
    const x = getRandomInRange(0, size.width);
    const y = getRandomInRange(0, size.height);
    const flower = { ...seeds[id], position: { x: x, y: y }, progress: 0 };
    newPlanted.push(flower);
    if (newPlanted.length / size.width > 0.8) {
      newWidth = (size.width * 1.2).toFixed(0) * 1;
      newHeight = (size.height * 1.2).toFixed(0) * 1;
    }
    const left = seeds.slice(0, id);
    const right = seeds.slice(id + 1);
    setSeeds(left.concat(right));
    setPlanted(newPlanted);
    setSize({ width: newWidth, height: newHeight });
  }

  async function checkForCompletion(id) {
    setCheckingCompletion(true);
    if (stravaConnected) {
      const activity = planted[id].activity;
      // Iterate through all recent strava data
      let earned = 0;
      await getActivities().then((res) => {
        // Find activity that meets criteria
        const validActivity = res.find(
          (v) => v?.sport_type === activity.params.sport
        );
        if (validActivity) {
          earned +=
            (validActivity?.distance / activity.params.distance) *
            planted[id].reward;
        }
        // If User made progress
        if (earned) {
          planted[id].progress += earned;
          // If complete
          if (planted[id].progress >= planted[id].reward) {
            // Log to console
            console.log(`${currentUser.displayName} grew a flower...`);
            // Increase User points
            setPoints(points + planted[id].reward);
            // Add new activity data
            addUserActivity(currentUser.uid, {
              time: new Date().toJSON(),
              title: planted[id].title,
            });
            // Check if level has increased
            const boundaries = [0, 40, 120, 280, 440, 9999999999999];
            const newLevel = boundaries.findIndex((v) => points < v) - 1;
            setLevel(newLevel);
          }
          // Notify listener of changes
          console.log(`${currentUser.displayName} earned ${earned} points...`);
          setChanges(true);
        }
      });
    }
    setCheckingCompletion(false);
  }

  // function uprootFlower(id) {
  //   let left = planted.splice(0, id);
  //   let right = planted.splice(id + 1);
  //   let data = left.concat(right);
  //   setGardenData({
  //     ...gardenData,
  //     planted: data,
  //   });
  // }

  function openFlower(id) {
    if (flowerOpenData !== id) setFlowerOpenData(id);
    setFlowerOpen(true);
    if (planted[id].progress < planted[id].reward) checkForCompletion(id);
  }

  if (loading)
    return (
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CircularProgress variant="indeterminate" />
      </Box>
    );

  return (
    <Box height="100%" overflow="hidden">
      <Container maxWidth="xl">
        <div id="Info Bubbles" style={{ position: "relative" }}>
          <Stack
            spacing={1}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              pr: 1,
              pt: 2,
            }}
          >
            <Tooltip title="Level">
              <Avatar sx={{ bgcolor: grey[300] }}>
                <Typography fontWeight={600}>{level}</Typography>
              </Avatar>
            </Tooltip>
            <Tooltip title="Points">
              <Avatar sx={{ bgcolor: green[400] }}>
                <Typography fontWeight={600}>{points}</Typography>
              </Avatar>
            </Tooltip>
            <Tooltip title="Streak">
              <Avatar sx={{ bgcolor: orange[500] }}>
                <Typography fontWeight={600}>{streak}</Typography>
              </Avatar>
            </Tooltip>
            {saving && (
              <Tooltip title="Saving">
                <Avatar sx={{ bgcolor: grey[300] }}>
                  <CloudUpload />
                </Avatar>
              </Tooltip>
            )}
          </Stack>
        </div>
      </Container>
      <div id="Flower Details" style={{ position: "relative" }}>
        <Zoom in={flowerOpen}>
          <Paper
            sx={{
              zIndex: 99,
              position: "absolute",
              m: 2,
              p: 2,
              left: 0,
              top: 0,
              maxWidth: "75vw",
              maxHeight: "50vh",
            }}
          >
            <Stack direction={"column"} spacing={1} width="100%" flexGrow={1}>
              <Typography width={"100%"} variant="h5">
                {planted[flowerOpenData]?.title}
              </Typography>
              <Typography width={"100%"} variant="body1">
                {planted[flowerOpenData]?.description}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Chip
                  icon={<LocalFloristSharp />}
                  label={planted[flowerOpenData]?.reward}
                  variant={"outlined"}
                  size={"small"}
                  color={"success"}
                />
                <img
                  style={{ maxHeight: 30, maxWidth: 30 }}
                  alt={planted[flowerOpenData]?.title}
                  src={planted[flowerOpenData]?.photoURL}
                />
              </Stack>
              {!stravaConnected ? (
                <Button href="/strava">Connect Strava</Button>
              ) : flowerOpen && checkingCompletion ? (
                <Stack
                  direction="row"
                  alignItems="center"
                  textAlign="center"
                  spacing={2}
                >
                  <CircularProgress variant="indeterminate" />
                  <Typography variant="body1">
                    Checking for completion...
                  </Typography>
                </Stack>
              ) : planted[flowerOpenData]?.progress ===
                planted[flowerOpenData]?.reward ? (
                <Stack
                  direction="row"
                  alignItems="center"
                  textAlign="center"
                  spacing={2}
                  color="gold"
                >
                  <CheckCircle color="inherit" />
                  <Typography variant="body1">You did it!</Typography>
                </Stack>
              ) : (
                <Stack
                  direction="row"
                  alignItems="center"
                  textAlign="center"
                  spacing={2}
                  color="orange"
                >
                  <DirectionsRunRoundedIcon color="inherit" />
                  <Typography variant="body1">You've got this!</Typography>
                </Stack>
              )}
            </Stack>
          </Paper>
        </Zoom>
      </div>
      <GardenRender
        size={size}
        planted={planted}
        openFlower={openFlower}
        outsideFlower={() => setFlowerOpen(false)}
      />
      {/* Seed drawer, containing user flower cards */}
      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        swipeAreaWidth={drawerBleed}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        disableSwipeToOpen={false}
        PaperProps={{
          sx: {
            height: `calc(50% - ${drawerBleed}px)`,
            overflow: "visible",
          },
        }}
      >
        {/* The top edge of the drawer that 'bleeds' into view */}
        <Box
          onClick={toggleDrawer(!drawerOpen)}
          sx={{
            bgcolor: "inherit",
            position: "absolute",
            top: -drawerBleed,
            p: 3,
            height: drawerBleed,
            right: 0,
            left: 0,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            pointerEvents: "all",
            visibility: "visible",
          }}
        >
          <Puller />
          {/* Indicate how many flower cards are in the drawer */}
          <Typography variant="body-1">
            Seed Box {"("}
            {seeds.length} Seed
            {seeds.length > 1 || seeds.length === 0 ? "s" : ""}
            {")"}
          </Typography>
        </Box>
        {/* The contents of the drawer, visible when opened */}
        <Box
          sx={{
            bgcolor: "inherit",
            height: "100%",
            overflow: "auto",
          }}
        >
          {/* A list of flower cards */}
          <List sx={{ p: 2 }}>
            {seeds.length === 0 ? (
              <Paper
                variant="outlined"
                sx={{ p: 2, width: "100%", display: "flex" }}
              >
                <Typography variant="h5">
                  It looks like you're out of seeds! 😨 There's no need to panic
                  though, keep growing flowers to earn points, level up and
                  before you know it more seeds will pop up here!
                </Typography>
              </Paper>
            ) : (
              // Populate the list with flower cards rendered with user data
              seeds.map((seed, i) => (
                <FlowerCard
                  plantSeed={() => plantSeed(i)}
                  key={i}
                  data={seed}
                />
              ))
            )}
          </List>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
}

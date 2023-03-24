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
  const [gardenData, setGardenData] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [flowerOpenData, setFlowerOpenData] = useState(null);
  const [flowerOpen, setFlowerOpen] = useState(false);
  const [checkingCompletion, setCheckingCompletion] = useState(false);
  const toggleDrawer = (newOpen) => () => setDrawerOpen(newOpen);
  const stravaConnected = localStorage.getItem("STRAVA_ACCESS_TOKEN");
  const [changes, setChanges] = useState();
  const drawerBleed = 70;

  // Data update functions ----------------------------------------- //
  // function updateGardenSizeBy(width, height) {
  //    setGardenData({
  //       ...gardenData,
  //       gardenSize: {
  //          width: gardenData.gardenSize.width + width,
  //          height: gardenData.gardenSize.height + height,
  //       },
  //    });
  // }
  // --------------------------------------------------------------- //

  // Autosave data
  useEffect(() => {
    setSaving(true);
    async function checkLevel() {
      const incomplete = gardenData.planted.filter(
        (v) => v.progress !== v.reward
      ).length;
      if (gardenData.seeds.length === 0 && incomplete === 0) {
        const compoundLevel = [...Array(gardenData.level + 1).keys()];
        Promise.all(
          compoundLevel.map(
            async (v) =>
              await giveUserFlowerCardList(currentUser.uid, `lvl${v}`)
          )
        ).then(async (flag) => {
          const data = await readFormattedGardenData(currentUser.uid, true);
          setGardenData(data);
        });
      }
    }
    async function runAutosave() {
      writeGardenData(currentUser.uid, gardenData);
    }
    async function loadChanges() {
      writeGardenData(currentUser.uid, gardenData);
      const data = await readFormattedGardenData(currentUser.uid, true);
      setGardenData(data);
      setChanges(false);
    }
    if (!loading && !changes) {
      checkLevel().then(runAutosave());
    }
    if (changes) {
      loadChanges();
    }
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  }, [currentUser, gardenData, loading, changes]);

  // Fetch data on mount
  useEffect(() => {
    async function loadGardenData() {
      const data = await readFormattedGardenData(currentUser.uid, true);
      setGardenData(data);
      setLoading(false);
    }
    setLoading(true);
    loadGardenData();
  }, [currentUser]);

  function getRandomInRange(from, to) {
    return (Math.random() * (to - from) + from).toFixed(0) * 1;
  }

  function plantSeed(id) {
    let seeds = gardenData.seeds;
    let planted = gardenData.planted;
    let newWidth = gardenData.gardenSize.width;
    let newHeight = gardenData.gardenSize.height;
    const x = getRandomInRange(0, gardenData.gardenSize.width);
    const y = getRandomInRange(0, gardenData.gardenSize.height);
    const flower = { ...seeds[id], position: { x: x, y: y }, progress: 0 };
    planted.push(flower);
    if (gardenData.planted.length / gardenData.gardenSize.width > 0.8) {
      newWidth = (gardenData.gardenSize.width * 1.2).toFixed(0) * 1;
      newHeight = (gardenData.gardenSize.height * 1.2).toFixed(0) * 1;
    }
    const left = seeds.slice(0, id);
    const right = seeds.slice(id + 1);
    seeds = left.concat(right);
    setGardenData({
      ...gardenData,
      seeds: seeds,
      planted: planted,
      gardenSize: { width: newWidth, height: newHeight },
    });
  }

  async function checkForCompletion(id) {
    setCheckingCompletion(true);
    if (stravaConnected) {
      const activity = gardenData.planted[id].activity;
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
            gardenData.planted[id].reward;
        }
        // If User made progress
        if (earned) {
          gardenData.planted[id].progress += earned;
          // If complete
          if (
            gardenData.planted[id].progress >= gardenData.planted[id].reward
          ) {
            // Log to console
            console.log(`${currentUser.displayName} grew a flower...`);
            // Increase User points
            gardenData.points += gardenData.planted[id].reward;
            // Add new activity data
            addUserActivity(currentUser.uid, {
              time: new Date().toJSON(),
              title: gardenData.planted[id].title,
            });
            // Check if level has increased
            const boundaries = [0, 40, 120, 280, 440, 9999999999999];
            const newLevel =
              boundaries.findIndex((v) => gardenData.points < v) - 1;
            gardenData.level = newLevel;
          }
          // Notify listener of changes
          console.log(`${currentUser.displayName} earned ${earned} points...`);
          setGardenData(gardenData);
          setChanges(true);
        }
      });
    }
    setCheckingCompletion(false);
  }

  // function uprootFlower(id) {
  //   let left = gardenData.planted.splice(0, id);
  //   let right = gardenData.planted.splice(id + 1);
  //   let data = left.concat(right);
  //   setGardenData({
  //     ...gardenData,
  //     planted: data,
  //   });
  // }

  function openFlower(id) {
    if (flowerOpenData !== id) setFlowerOpenData(id);
    setFlowerOpen(true);
    if (gardenData.planted[id].progress !== gardenData.planted[id].reward)
      checkForCompletion(id);
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
                <Typography fontWeight={600}>{gardenData.level}</Typography>
              </Avatar>
            </Tooltip>
            <Tooltip title="Points">
              <Avatar sx={{ bgcolor: green[400] }}>
                <Typography fontWeight={600}>{gardenData.points}</Typography>
              </Avatar>
            </Tooltip>
            <Tooltip title="Streak">
              <Avatar sx={{ bgcolor: orange[500] }}>
                <Typography fontWeight={600}>{gardenData.streak}</Typography>
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
                {gardenData.planted[flowerOpenData]?.title}
              </Typography>
              <Typography width={"100%"} variant="body1">
                {gardenData.planted[flowerOpenData]?.description}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Chip
                  icon={<LocalFloristSharp />}
                  label={gardenData.planted[flowerOpenData]?.reward}
                  variant={"outlined"}
                  size={"small"}
                  color={"success"}
                />
                <img
                  style={{ maxHeight: 30, maxWidth: 30 }}
                  alt={gardenData.planted[flowerOpenData]?.title}
                  src={gardenData.planted[flowerOpenData]?.photoURL}
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
              ) : gardenData.planted[flowerOpenData]?.progress ===
                gardenData.planted[flowerOpenData]?.reward ? (
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
        gardenData={gardenData}
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
            {gardenData.seeds.length} Seed
            {gardenData.seeds.length > 1 || gardenData.seeds.length === 0
              ? "s"
              : ""}
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
            {gardenData.seeds.length === 0 ? (
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
              gardenData.seeds.map((seed, i) => (
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

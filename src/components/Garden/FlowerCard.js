import { LocalFloristSharp } from "@mui/icons-material";
import { Button, Chip, ListItem } from "@mui/material";
import { Paper, Stack, Typography } from "@mui/material";

export default function FlowerCard({ data, plantSeed }) {
  const { title, description, photoURL, reward } = data;
  return (
    <ListItem sx={{ width: "100%" }}>
      <Paper variant="outlined" sx={{ p: 2, width: "100%", display: "flex" }}>
        <Stack direction={"column"} spacing={1} width="100%" flexGrow={1}>
          <Typography width={"100%"} variant="h5">
            {title}
          </Typography>
          <Typography width={"100%"} variant="body1">
            {description}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Chip
              icon={<LocalFloristSharp />}
              label={reward}
              variant={"outlined"}
              size={"small"}
              color={"success"}
            />
            <img
              style={{ maxHeight: 30, maxWidth: 30 }}
              alt={title}
              src={photoURL}
            />
          </Stack>
        </Stack>
        <Button onClick={plantSeed}>Plant!</Button>
      </Paper>
    </ListItem>
  );
}

import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";

export default function Puller() {
  return (
    <Box
      sx={{
        width: 30,
        height: 6,
        backgroundColor: grey[700],
        borderRadius: 3,
        position: "absolute",
        top: 8,
        left: "calc(50% - 15px)",
      }}
    />
  );
}

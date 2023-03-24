import { Box } from "@mui/material";
import Flower from "./Flower";

export default function GardenRender({
  gardenData,
  openFlower = () => {},
  outsideFlower = () => {},
}) {
  return (
    /* TODO: Could-have: pinch and zoom */
    <Box height="100%" overflow="auto">
      <Box
        sx={{
          width: "150vw",
          height: "150vh",
          backgroundImage: "url(/images/garden/garden-background.jpeg)",
          backgroundSize: "500px 500px",
          backgroundRepeat: "repeat",
          display: "grid",
          gridTemplateColumns: `repeat(${gardenData.gardenSize.width}, 1fr)`,
          gridTemplateRows: `repeat(${gardenData.gardenSize.height}, 1fr)`,
          padding: 4,
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {gardenData.planted.map((seed, i) => {
          return (
            <Flower
              openFlower={() => openFlower(i)}
              outsideFlower={outsideFlower}
              key={i}
              data={seed}
            />
          );
        })}
      </Box>
    </Box>
  );
}

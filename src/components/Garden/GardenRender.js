import { Box } from "@mui/material";
import Flower from "./Flower";

export default function GardenRender({
  size,
  planted,
  openFlower = () => {},
  outsideFlower = () => {},
}) {
  return (
    /* TODO: Could-have: pinch and zoom */
    <Box height="100%" overflow="auto">
      <Box
        sx={{
          width: `${100 * (size.width / 5)}%`,
          height: `${100 * (size.height / 5)}%`,
          backgroundImage: "url(/images/garden/garden-background.jpeg)",
          backgroundSize: "500px 500px",
          backgroundRepeat: "repeat",
          display: "grid",
          gridTemplateColumns: `repeat(${size.width}, 1fr)`,
          gridTemplateRows: `repeat(${size.height}, 1fr)`,
          padding: 4,
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {planted.map((seed, i) => {
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

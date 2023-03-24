import { CheckCircle } from "@mui/icons-material";
import { Box, LinearProgress, Stack } from "@mui/material";
import { useEffect, useRef } from "react";

export default function Flower({ data, openFlower, outsideFlower }) {
  // Close flower info page when flower clicked off of
  const useOutsideClick = (callback) => {
    const ref = useRef();
    useEffect(() => {
      const handleClick = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      };
      document.addEventListener("click", handleClick, true);
      // Clean up on unmount
      return () => {
        document.removeEventListener("click", handleClick, true);
      };
    }, [ref, callback]);

    return ref;
  };

  const outsideClick = useOutsideClick(outsideFlower);

  const { title, photoURL, position, progress, reward } = data;
  const { x, y } = position;
  return (
    <Stack
      onClick={openFlower}
      ref={outsideClick}
      direction={"column"}
      spacing={1}
      sx={{
        alignSelf: "center",
        textAlign: "center",
        justifySelf: "center",
        gridColumn: `${x}`,
        gridRow: `${y}`,
        maxWidth: reward * 3,
        maxHeight: reward * 3,
      }}
    >
      <img src={photoURL} alt={title} />
      <Box
        sx={{
          width: "100%",
          color: progress < reward ? "white" : "gold",
        }}
      >
        {progress < reward ? (
          <LinearProgress
            variant="determinate"
            value={(progress / reward) * 100}
            color={"inherit"}
          />
        ) : (
          <CheckCircle color="inherit" />
        )}
      </Box>
    </Stack>
  );
}

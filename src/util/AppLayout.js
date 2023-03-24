// import required components
import { Box } from "@mui/system";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

/**
 * Defines app layout, stretching all components to the full height of the view.
 * 
 * @returns Tags to strech components to the full view height.
 */
export default function AppLayout() {
  return (
    <Box display="flex" flexDirection="column" height="100%" m={0} p={0}>
      <Navbar />
      <Outlet />
    </Box>
  );
}

import { AppBar, Box, Button, ButtonBase, Toolbar } from "@mui/material";
import { IconButton, Menu, MenuItem, Typography, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Container } from "@mui/system";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../util/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout, profileData } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const openNavMenu = (e) => setAnchorElNav(e.currentTarget);
  const closeNavMenu = (e) => setAnchorElNav(null);
  const openUserMenu = (e) => setAnchorElUser(e.currentTarget);
  const closeUserMenu = (e) => setAnchorElUser(null);

  // Navbar items ------------------------------------------------ //

  // create a list of general navbar items
  const navItems = [
    { link: "/", label: "Profile" },
    { link: "/garden", label: "Garden" },
    { link: "/leaderboard", label: "Leaderboard" },
  ];

  // create a list of user specific navbar items
  const userItems = currentUser
    ? [
        { link: "/settings", label: "Settings" },
        { func: handleLogout, label: "Logout" },
      ]
    : [{ link: "/login", label: "Login" }];

  /**
   * Handles logging out a user.
   */
  async function handleLogout() {
    // attempt to log the user out
    try {
      await logout();
      closeUserMenu();
      // direct the user back to the login page
      navigate("/login");
    } catch (error) {
      // Send full error message to console
      console.log(error);
    }
  }

  // Custom Navbar Components ------------------------------------ //

  /**
   * A component for the navbar menu.
   * @param {*} props Items in the navbar.
   */
  const NavMenuItem = (props) => {
    // unpack the input
    const { link, label } = props;
    // display the menu item
    return (
      <MenuItem component={Link} to={link} onClick={closeNavMenu}>
        {label}
      </MenuItem>
    );
  };

  /**
   * A component for the user menu.
   * @param {*} props vItems in the navbar.
   */
  const UserMenuItem = (props) => {
    // unpack the input
    const { link, label, func } = props;
    // display the menu item
    return func ? (
      <MenuItem component={ButtonBase} onClick={func}>
        {label}
      </MenuItem>
    ) : (
      <MenuItem component={Link} to={link} onClick={closeUserMenu}>
        {label}
      </MenuItem>
    );
  };

  /**
   * A button on the navbar.
   * @param {*} props Items on the navbar.
   */
  const NavButton = (props) => {
    // unpack the input
    const { link, label } = props;
    // display the button
    return (
      <Button
        style={{ textAlign: "center" }}
        sx={{ color: "white", display: "block" }}
        href={link}
      >
        {label}
      </Button>
    );
  };

  // ------------------------------------------------------------- //

  // display the navbar
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              aria-haspopup="menu"
              aria-controls="nav-menu"
              onClick={openNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="nav-menu"
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={closeNavMenu}
            >
              {navItems.map((v, i) => (
                <NavMenuItem key={i} label={v.label} link={v.link} />
              ))}
            </Menu>
          </Box>
          <Box
            mr={{ xs: 0, md: 1 }}
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            <Box
              component="img"
              mr={1}
              width={30}
              height={30}
              src="images/icon.png"
            />
            <Typography variant="h5">StepUp</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {navItems.map((v, i) => (
              <NavButton key={i} label={v.label} link={v.link} />
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              aria-haspopup="menu"
              aria-controls="user-menu"
              onClick={openUserMenu}
            >
              <Avatar alt={profileData.username} src={profileData.photoURL} />
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={closeUserMenu}
            >
              {userItems.map((v, i) => (
                <UserMenuItem
                  key={i}
                  func={v.func}
                  label={v.label}
                  link={v.link}
                />
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

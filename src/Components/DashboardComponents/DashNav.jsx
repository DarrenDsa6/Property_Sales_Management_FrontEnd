import React from "react"; // Import React
import { styled } from "@mui/material/styles"; // Import styled for creating styled components
import MuiAppBar from "@mui/material/AppBar"; // Import AppBar component from MUI
import Toolbar from "@mui/material/Toolbar"; // Import Toolbar component for consistent app bar layout
import Typography from "@mui/material/Typography"; // Import Typography for text elements
import IconButton from "@mui/material/IconButton"; // Import IconButton for buttons with icons
import MenuIcon from "@mui/icons-material/Menu"; // Import Menu icon for the drawer toggle
import { Button } from "@nextui-org/react"; // Import Button from Next UI for consistent styling
import { useTheme } from "next-themes"; // Import useTheme hook for theme management
import moonIcon from "/moon.png"; // Import moon icon for light mode
import sunIcon from "/sun.png"; // Import sun icon for dark mode
import { AcmeLogo } from "../CommonComponents/AcmeLogo"; // Import custom logo component
import Box from "@mui/material/Box"; // Import Box for layout management
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

// Styled AppBar component with conditional styling based on theme and drawer state
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 240, // Adjust margin when drawer is open
    width: `calc(100% - 240px)`, // Adjust width accordingly
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Dashboard Navigation component
const DashNav = ({ open, handleDrawerOpen }) => {
  const { theme, setTheme } = useTheme(); // Extract theme context
  const navigate = useNavigate(); // Initialize navigation

  // Toggle between dark and light themes
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Sign out function to clear user data and redirect
  const handleSignOut = () => {
    localStorage.removeItem("userId"); // Clear userId from local storage
    navigate("/login"); // Redirect to the login page
    window.location.reload(); // Reload the page
  };

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen} // Open drawer on button click
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: "none" }), // Hide button when drawer is open
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <a href="">
            <AcmeLogo className="mr-2" /> {/* Render custom logo */}
          </a>
          <Typography variant="h6" noWrap component="div" sx={{ ml: 1 }}>
            <a href="">Mercurial</a> {/* Website name with link */}
          </Typography>
        </Box>
        <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
          <Button
            onClick={toggleTheme} // Toggle theme on button click
            className="rounded-full border-none relative p-2"
            variant="ghost"
          >
            <img
              src={moonIcon}
              alt="Light Mode"
              className={`absolute transition-opacity duration-500 ${theme === "dark" ? "opacity-0" : "opacity-100"} w-7 h-7`}
            />
            <img
              src={sunIcon}
              alt="Dark Mode"
              className={`absolute transition-opacity duration-500 ${theme === "dark" ? "opacity-100" : "opacity-0"} w-8 h-8`}
            />
          </Button>
          <Button
            className="rounded-full border-none relative p-2 ml-1"
            variant="solid"
            onClick={handleSignOut} // Call the sign out function
            sx={{
              color: "black",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "transparent", // Make hover effect transparent
              },
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default DashNav; // Export DashNav for use in other components
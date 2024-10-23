// SideNav.jsx
import React from 'react'; // Import React
import { styled, useTheme } from '@mui/material/styles'; // Import styled for custom styling and useTheme for theme context
import MuiDrawer from '@mui/material/Drawer'; // Import Drawer component from MUI
import IconButton from '@mui/material/IconButton'; // Import IconButton for clickable icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // Import left chevron icon
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; // Import right chevron icon
import List from '@mui/material/List'; // Import List component for navigation items
import ListItem from '@mui/material/ListItem'; // Import ListItem for individual navigation items
import ListItemButton from '@mui/material/ListItemButton'; // Import ListItemButton for clickable list items
import ListItemIcon from '@mui/material/ListItemIcon'; // Import ListItemIcon for icons in the list
import ListItemText from '@mui/material/ListItemText'; // Import ListItemText for text in the list
import Divider from '@mui/material/Divider'; // Import Divider for separating sections
import ApartmentSharpIcon from '@mui/icons-material/ApartmentSharp'; // Import property icon
import AddLocationAltSharpIcon from '@mui/icons-material/AddLocationAltSharp'; // Import location icon
import PersonSharpIcon from '@mui/icons-material/PersonSharp'; // Import profile icon
import SupportAgentSharpIcon from '@mui/icons-material/SupportAgentSharp'; // Import support icon
import { Link } from 'react-router-dom'; // Import Link for navigation

const drawerWidth = 240; // Set width for the drawer

// Function to style the opened drawer
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#fff', // Background color based on theme
  color: theme.palette.mode === 'dark' ? '#fff' : '#000', // Text color based on theme
});

// Function to style the closed drawer
const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`, // Adjust width when closed
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`, // Adjust width for larger screens
  },
});

// Styled component for the drawer header
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar, // Use MUI's mixins for consistent toolbar styles
}));

// Styled drawer component
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme), // Apply opened styles to drawer paper
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme), // Apply closed styles to drawer paper
    }),
  }),
);

// SideNav component definition
const SideNav = ({ open, handleDrawerClose }) => {
  const theme = useTheme(); // Access the current theme

  // Icons and labels for navigation
  const icons = [
    <PersonSharpIcon />, // Icon for Profile
    <ApartmentSharpIcon />, // Icon for Properties
    <AddLocationAltSharpIcon />, // Icon for Locations
    <SupportAgentSharpIcon />, // Icon for Support
  ];

  const labels = ['Profile', 'Properties', 'Locations', 'Support'];

  // Define the routes corresponding to each label
  const routes = ['/dashboard', '/dashboard/properties', '/dashboard/locations', '/dashboard/support'];

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}> {/* Close drawer button */}
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider /> {/* Divider to separate header from the list */}
      <List>
        {labels.map((text, index) => (
          <ListItem key={text} disablePadding sx={{ display: 'block' }}>
            <Link to={routes[index]} style={{ textDecoration: 'none' }}> {/* Link to route */}
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#fff', // Background color based on theme
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000', // Text color based on theme
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#666' : '#f5f5f5', // Hover effect based on theme
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto', // Adjust margin based on drawer state
                    justifyContent: 'center',
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000', // Icon color based on theme
                  }}
                >
                  {icons[index]} {/* Render corresponding icon */}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} /> {/* Render text with opacity based on drawer state */}
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider /> {/* Divider to separate navigation items from the bottom */}
    </Drawer>
  );
};

export default SideNav; // Export SideNav for use in other components
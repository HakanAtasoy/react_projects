import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AppBar, Toolbar, Button, ListItemButton, IconButton, Avatar, Container, Drawer, List, ListItemText, Divider, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import { useAuth } from '../../context';
import PropTypes from 'prop-types';
import Logo from "/logo_no-bg.png";

const Layout = ({ children }) => {
    const { user, logout } = useAuth(); // Custom hook to manage user state
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // the change to hamburger menu
    const navigate = useNavigate();


    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const drawer = (
        <div>
            <Divider />
            <List>
                {user && (
                    <>
                        {user.role === 'admin' && (
                            <>
                                <ListItemButton component={Link} to="/messages">
                                    <ListItemText primary="Messages" />
                                </ListItemButton>
                                <ListItemButton component={Link} to="/users">
                                    <ListItemText primary="Users" />
                                </ListItemButton>
                                <ListItemButton component={Link} to="/reports">
                                    <ListItemText primary="Reports" />
                                </ListItemButton>
                            </>
                        )}
                        {user.role === 'reader' && (
                            <ListItemButton component={Link} to="/messages">
                                <ListItemText primary="Messages" />
                            </ListItemButton>
                        )}
                    </>
                )}
            </List>
            <Divider />
        </div>
    );


    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    {isMobile && user ? (
                        <>                     
                            <IconButton component={Link} to="/" sx={{ mr: 2 }}>
                                <img src={Logo} alt="Logo" style={{ height: 40 }} /> 
                            </IconButton>   
                            <Box sx={{ flexGrow: 1 }} />
                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
                                <MenuIcon />
                            </IconButton>
                            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                                {drawer}
                            </Drawer>
                            <IconButton onClick={handleMenuOpen}>
                                <Avatar src={user.base64Photo} />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem disabled>{user.username}</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <IconButton component={Link} to="/" sx={{ mr: 2 }}>
                                <img src={Logo} alt="Logo" style={{ height: 60}} /> 
                            </IconButton>    
                            <Box sx={{ flexGrow: 1 }} /> {/* Spacer to push login button to the right */}
                            {!user && (
                                <Button color="inherit" onClick={handleLogin}>Login</Button>
                            )}                       
                            {user && (
                                <>
                                    {user.role === 'admin' && (
                                        <>
                                            <Button color="inherit" component={Link} to="/messages">Messages</Button>
                                            <Button color="inherit" component={Link} to="/users">Users</Button>
                                            <Button color="inherit" component={Link} to="/reports">Reports</Button>
                                        </>
                                    )}
                                    {user.role === 'reader' && (
                                        <Button color="inherit" component={Link} to="/messages">Messages</Button>
                                    )}
                                    <IconButton onClick={handleMenuOpen}>
                                        <Avatar src={user.base64Photo} />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem disabled>{user.username}</MenuItem>
                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    </Menu>
                                </>
                            )}
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Container>
                {children}
            </Container>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired, // Define children as a required prop
};

export default Layout;

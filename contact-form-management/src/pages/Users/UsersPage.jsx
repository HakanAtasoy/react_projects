import { useGetUsersQuery } from '../../features';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Snackbar, Alert, Avatar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const UsersPage = () => {
    const { data, isLoading, error } = useGetUsersQuery();
    const users = data?.data.users || []; 

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const location = useLocation();


    useEffect(() => {
        if (location.state?.message) {
            setSnackbarMessage(location.state.message);
            setOpenSnackbar(true);
            // Clear the message after displaying the snackbar
        }
    }, [location]);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <Container style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>Users</Typography>
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/add-user"
                style={{ marginBottom: '2rem' }}
            >
                Add User
            </Button>
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Avatar src={user.base64Photo} alt={user.username} style={{ width: '40px', height: '40px' }} />
                                        <Typography variant="body2">{user.username}</Typography>
                                    </div>
                                    </TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <Button
                                            component={Link}
                                            to={`/update-user/${user.id}`}
                                            variant="outlined"
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            {/* Snackbar for success messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default UsersPage;

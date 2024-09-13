import { useGetMessagesQuery } from '../../features'; 
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert } from '@mui/material';
import { useAuth } from '../../context'; 
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MessagesPage = () => {
    const { user } = useAuth(); // Get user role from context
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetMessagesQuery();
    const messages = data?.data.messages || []; // Access messages from data

    const location = useLocation();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (user.role !== 'admin' && user.role !== 'reader') {
            navigate('/not-authorized'); // Redirect to not authorized page if role is not allowed
        }
    }, [user.role, navigate]);

    useEffect(() => {
        if (location.state?.message) {
            setSnackbarMessage(location.state.message);
            setSnackbarOpen(true);
            // Clear the message after displaying the snackbar
        }
    }, [location]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleRowClick = (id) => {
        navigate(`/messages/${id}`); // Redirect to MessageDetailPage with the message ID
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <TableContainer component={Paper} sx={{ mt: 5 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Country</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {messages.map((message) => (
                        <TableRow 
                            key={message.id} 
                            onClick={() => handleRowClick(message.id)} // Add click handler
                            sx={{ cursor: 'pointer' }} // Optional: Change cursor to pointer
                        >
                            <TableCell>{message.name}</TableCell>
                            <TableCell>{message.message}</TableCell>
                            <TableCell>{message.gender}</TableCell>
                            <TableCell>{message.country}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    message={snackbarMessage}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
            </Snackbar>   
        </TableContainer>
    );
};

export default MessagesPage;

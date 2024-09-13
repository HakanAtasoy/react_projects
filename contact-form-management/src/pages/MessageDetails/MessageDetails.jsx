import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetMessageByIdQuery, useMarkMessageAsReadMutation, useDeleteMessageMutation } from '../../features';
import { Button, Typography, Paper, Container, Grid } from '@mui/material';
import { useAuth } from '../../context';

const MessageDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data, isLoading, error } = useGetMessageByIdQuery(id);
    const message = data?.data.message || {}; // Access messages from data
    const [deleteMessage] = useDeleteMessageMutation();
    const [markMessageAsRead] = useMarkMessageAsReadMutation();

    useEffect(() => {
        if (user.role === 'reader' || user.role === 'admin') {
            markMessageAsRead(id); // Mark message as read when viewed
        } else {
            navigate('/not-authorized');
        }
    }, [user, id, navigate, markMessageAsRead]);

    const handleDelete = async () => {
        try {
            await deleteMessage(id).unwrap();
            navigate('/messages', { state: { message: 'Deleted message successfully!' } });
        } catch (err) {
            console.error('Failed to delete message:', err);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    

    return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
            <Paper style={{ padding: '2rem' }}>
                <Typography variant="h4" gutterBottom>
                    Message Details
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" color="textSecondary">
                            Name:
                        </Typography>
                        <Typography variant="body1">
                            {message.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" color="textSecondary">
                            Country:
                        </Typography>
                        <Typography variant="body1">
                            {message.country}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" color="textSecondary">
                            Message:
                        </Typography>
                        <Typography variant="body1">
                            {message.message}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" color="textSecondary">
                            Gender:
                        </Typography>
                        <Typography variant="body1">
                            {message.gender}
                        </Typography>
                    </Grid>
                </Grid>
                {user.role === 'admin' && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        style={{ marginTop: '2rem' }}
                    >
                        Delete
                    </Button>
                )}
            </Paper>
        </Container>
    );
};

export default MessageDetailsPage;

import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotAuthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                }}
            >
                <Typography component="h1" variant="h5">
                    Not Authorized
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    You do not have permission to access this page.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                    sx={{ mt: 3 }}
                >
                    Go to Homepage
                </Button>
            </Box>
        </Container>
    );
};

export default NotAuthorizedPage;

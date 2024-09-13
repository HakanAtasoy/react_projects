import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAddUserMutation, useGetUserByIdQuery, useUpdateUserMutation } from '../../features/apiSlice';
import { Button, TextField, Container, Typography, Paper, Avatar } from '@mui/material';

const AddUpdateUserPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { refetch } = useGetUserByIdQuery(id, { skip: !id });
    const [name, setName] = useState('');
    const [password, setPassword] = useState(''); // State for password
    const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
    const [photo, setPhoto] = useState(''); // State for base64 photo
    const [newPhoto, setNewPhoto] = useState(''); // State for new photo preview
    const [addUser] = useAddUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const { data, isLoading } = useGetUserByIdQuery(id, { skip: !id });
    const user = useMemo(() => data?.data.user || {}, [data]);

    useEffect(() => {
        if (user) {
            setName(user.username);
            setPassword(user.password);
            setConfirmPassword(user.password);
            setPhoto(user.base64Photo || ''); // Set photo if it exists
        }
    }, [user]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            const photoToSubmit = newPhoto || photo; 
            if (id) {
                await updateUser({ id, username: name, password,base64Photo: photoToSubmit });
                refetch(); // Refetch the data to get the updated user details
                navigate('/users', { state: { message: 'User updated successfully!' } });
            } else {
                await addUser({ username: name, password, base64Photo: photoToSubmit });
                navigate('/users', { state: { message: 'User added successfully!' } });
            }
        } catch (error) {
            console.error('Failed to save user:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <Container style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                {id ? 'Update User' : 'Add User'}
            </Typography>
            <Paper style={{ padding: '2rem' }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />                    
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        style={{ marginTop: '1rem', marginBottom: '1rem' }}
                        required
                    />        
                    {/* Display current photo if available */}
                    {(newPhoto || photo) && (
                        <Avatar 
                            src={newPhoto || photo} 
                            alt="User Photo" 
                            style={{ width: 100, height: 100, marginBottom: '1rem' }}
                        />
                    )}                                
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '1rem' }}
                    >
                        {id ? 'Update User' : 'Add User'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default AddUpdateUserPage;

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Navigate, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useLoginMutation } from '../../features';
import { useAuth } from '../../context';



const LoginPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();

    if (loading) {
        // Show a loading spinner or nothing while checking auth status
        return <div>Loading...</div>;
    }

    if(user){
        return <Navigate to="/"  replace />;
    }


    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const { data } = await login(values).unwrap();
            localStorage.setItem('token', data.token); 
            navigate('/home', { state: { message: 'Login successfull!' } });
        } catch (err) {
            console.error('Login failed:', err);
            
            setErrors({ server: err.data?.error || 'Login failed. Please try again.' });
        } finally {
            setSubmitting(false); 
        }
    };

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
                    Login
                </Typography>
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={Yup.object({
                        username: Yup.string().required('Required'),
                        password: Yup.string().required('Required'),
                    })}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, errors }) => (
                        <Form style={{ width: '100%', marginTop: '1rem' }}>
                            <Field name="username">
                                {({ field }) => (
                                    <TextField
                                        {...field}
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        autoFocus
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="username">
                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                            </ErrorMessage>
                            <Field name="password">
                                {({ field }) => (
                                    <TextField
                                        {...field}
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="password">
                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                            </ErrorMessage>
                            {errors.server && <div style={{ color: 'red', marginTop: '1rem' }}>{errors.server}</div>}
                            {/*{isError && <div style={{ color: 'red', marginTop: '1rem' }}>{error.data.error || 'An unexpected error occurred'}</div>}*/}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting || isLoading}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Login
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Container>
    );
};

export default LoginPage;


import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Autocomplete, Snackbar, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetCountriesQuery, useAddMessageMutation } from '../../features';

const Homepage = () => {
    const navigate = useNavigate();
    const {data: { data: { countries = [] } = {} } = {}, isLoading: countriesLoading } = useGetCountriesQuery();
    const [addMessage, { isLoading }] = useAddMessageMutation();
    const [initialValues] = useState({ name: '', message: '', gender: '', country: '' });
    const location = useLocation();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (location.state?.message) {
            setSnackbarMessage(location.state.message);
            setSnackbarOpen(true);
            // Clear the message after displaying the snackbar
        }
    }, [location]);

    const handleSubmit = async (values, { setSubmitting, setErrors, resetForm  }) => {
        try {
            await addMessage(values).unwrap();
            resetForm();
            setSnackbarMessage('Message submitted successfully!');
            setSnackbarOpen(true);
            navigate('/'); 
        } catch (err) {
            console.error('Message submission failed:', err);
            setErrors({ server: 'Failed to submit message. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
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
                    Contact Form
                </Typography>
                <Formik
                    initialValues={initialValues}
                    validationSchema={Yup.object({
                        name: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
                        message: Yup.string().max(500, 'Must be 500 characters or less').required('Required'),
                        gender: Yup.string().oneOf(['male', 'female'], 'Invalid gender').required('Required'),
                        country: Yup.string().required('Required'),
                    })}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue, errors }) => (
                        <Form style={{ width: '100%', marginTop: '1rem' }}>
                            <Field name="name">
                                {({ field }) => (
                                    <TextField
                                        {...field}
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Name"
                                        inputProps={{ maxLength: 50 }} // Prevents entering more than 50 characters
                                        helperText={
                                            field.value.length == 50 ? 'Name cannot exceed 50 characters' : ''
                                        }
                                        error={field.value.length > 50}
                                        FormHelperTextProps={{ style: { color: 'red' } }} // Style the helper text
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="name">
                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                            </ErrorMessage>
                            <Field name="message">
                                {({ field }) => (
                                    <TextField
                                        {...field}
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="message"
                                        label="Message"
                                        multiline
                                        rows={4}
                                        inputProps={{ maxLength: 500 }} // Prevents entering more than 500 characters
                                        helperText={
                                            field.value.length == 500 ? 'Message cannot exceed 500 characters' : ''
                                        }
                                        error={field.value.length > 500}
                                        FormHelperTextProps={{ style: { color: 'red' } }}
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="message">
                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                            </ErrorMessage>
                            <Field name="gender">
                                {({ field }) => (
                                    <FormControl component="fieldset" margin="normal" fullWidth>
                                        <FormLabel component="legend">Gender</FormLabel>
                                        <RadioGroup {...field} aria-label="gender" name="gender">
                                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        </RadioGroup>
                                    </FormControl>
                                )}
                            </Field>
                            <ErrorMessage name="gender">
                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                            </ErrorMessage>
                            <Field name="country">
                                {({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        options={countries} // Directly use the flat array
                                        getOptionLabel={(option) => option} // Simply return the string itself
                                        isOptionEqualToValue={(option, value) => option.id === value.id} // Custom comparison since default implementation leads to an error because of objects pointing to the different instances.
                                        onChange={(event, value) => setFieldValue('country', value || '')} // Update field value
                                        value={values.country} // Set value directly from formik state
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Country"
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                            />
                                        )}
                                        loading={countriesLoading}
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="country">
                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                            </ErrorMessage>
                            {errors.server && <div style={{ color: 'red', marginTop: '1rem' }}>{errors.server}</div>}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting || isLoading}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Submit
                            </Button>
                        </Form>
                    )}
                </Formik>
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
            </Box>
        </Container>
    );
};

export default Homepage;

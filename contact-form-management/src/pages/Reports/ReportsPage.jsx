import { useEffect, useState } from 'react';
import { useGetMessagesQuery } from '../../features/apiSlice';
import { useAuth } from '../../context';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Container } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const ReportsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetMessagesQuery();
    const [barChartData, setBarChartData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        if (user.role !== 'admin') {
            navigate('/not-authorized');
        }
    }, [user.role, navigate]);

    useEffect(() => {
        if (data) {
            // Process data for bar chart
            const countries = {};
            const genders = { male: 0, female: 0 };
            data.data.messages.forEach((message) => {
                countries[message.country] = (countries[message.country] || 0) + 1;
                genders[message.gender] = (genders[message.gender] || 0) + 1;
            });

            // Convert to array and sort by count in descending order
            const sortedCountries = Object.entries(countries)
                .map(([country, count]) => ({ country, count }))
                .sort((a, b) => b.count - a.count); // Sort by count descending
            const genderData = Object.entries(genders).map(([gender, count]) => ({ gender, count }));

            setBarChartData(sortedCountries);
            setPieChartData(genderData);
            setIsDataLoaded(true);
        }
    }, [data]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!isDataLoaded) return <div>Loading charts...</div>;

    const colorMap = {
        male: '#66b3ff',
        female: '#ff9999'
    };

    return (
        <Container style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>Reports</Typography>
            <Paper style={{ padding: 16, marginBottom: 16 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Message Count by Country</Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="country" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
            <Paper style={{ padding: 16 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Message Count by Gender</Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieChartData}
                            dataKey="count"
                            nameKey="gender"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colorMap[entry.gender]} />
                            ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </Paper>
        </Container>
    );
};

export default ReportsPage;

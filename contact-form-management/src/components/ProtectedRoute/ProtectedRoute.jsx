import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context';
import PropTypes from 'prop-types'; 

const ProtectedRoute = ({ element: Component, roles, ...rest }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner or placeholder
    }
    // If user is authenticated and has the right role, render the component
    if (user && roles.includes(user.role)) {
        return <Component {...rest} />;
    }

    // Redirect based on authentication state
    return <Navigate to={user ? '/not-authorized' : '/login'} />;
};

ProtectedRoute.propTypes = {
    element: PropTypes.elementType.isRequired, 
    roles: PropTypes.arrayOf(PropTypes.string).isRequired, 
};

export default ProtectedRoute;

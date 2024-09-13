import { createContext, useState, useEffect } from 'react';
import { useCheckLoginMutation, useLogoutMutation } from '../features/apiSlice';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [checkLogin] = useCheckLoginMutation();
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          // If token exists, check login status
          const fetchUser = async () => {
            try {
              const response = await checkLogin().unwrap();
              setUser(response.data.user);
            } catch (error) {
              console.error('Error checking login:', error);
              localStorage.removeItem('token'); // Clear the token if it has expired or in case of error
              navigate('/login');
            } finally {
                setLoading(false); // Set loading to false after checking
            }
          };
          fetchUser();
        } else {
          // If no token, set user to null
          setUser(null);
          setLoading(false); // Set loading to false if no token
        }
      }, [checkLogin, navigate]);

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, logout: handleLogout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};


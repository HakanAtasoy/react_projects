import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, HomePage, NotAuthorizedPage, NotFoundPage, MessagesPage, ReportsPage, MessageDetailsPage, UsersPage, AddUpdateUserPage } from './pages';
import { Layout, ProtectedRoute } from './components';
import { AuthProvider } from './context';

const App = () => (
    <Router>
        <AuthProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/not-authorized" element={<NotAuthorizedPage />} />
                    <Route path="/not-found" element={<NotFoundPage />} />

                    {/* Add ProtectedRoute for pages requring authorization */}
                    <Route path="/messages" element={<ProtectedRoute element={MessagesPage} roles={['admin', 'reader']} />} />
                    <Route path="/reports" element={<ProtectedRoute element={ReportsPage} roles={['admin']} />} />
                    <Route path="/messages/:id" element={<ProtectedRoute element={MessageDetailsPage} roles={['admin', 'reader']} />} />
                    <Route path="/users" element={<ProtectedRoute element={UsersPage} roles={['admin']} />} />
                    <Route path="/add-user" element={<ProtectedRoute element={AddUpdateUserPage} roles={['admin']} />} />
                    <Route path="/update-user/:id" element={<ProtectedRoute element={AddUpdateUserPage} roles={['admin']} />} />

                    {/* Redirect all other routes to NotFoundPage */}
                    <Route path="*" element={<Navigate to="/not-found" />} />
                </Routes>
            </Layout>
        </AuthProvider>
    </Router>
);

export default App;


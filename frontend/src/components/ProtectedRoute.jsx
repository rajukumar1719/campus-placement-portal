import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Context } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthorized, user } = useContext(Context);

    // ✅ Not logged in
    if (!isAuthorized) {
        return <Navigate to="/login" replace />;
    }

    // ✅ Admin route but user is student
    if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/jobs" replace />;
    }

    // ✅ All checks passed
    return children;
};

export default ProtectedRoute;
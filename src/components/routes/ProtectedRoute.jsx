import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { isAuthenticated } from '../../services/api';

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default ProtectedRoute;

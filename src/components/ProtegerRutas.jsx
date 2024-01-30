import { Navigate, Outlet } from "react-router-dom";

export const ProtegerRutas = ({ auth, children }) => {
    if (!auth) {
        return <Navigate to='/login' replace />
    }

    return children ? children : <Outlet />
};
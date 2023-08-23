
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const PrivateRoute = ({ ChildComponent }: { ChildComponent: any }) => {
    const { accessToken } = useAuthContext()

    return accessToken ? ChildComponent : <Navigate to="/login" />
}

export default PrivateRoute;
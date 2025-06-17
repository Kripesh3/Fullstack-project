import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const OrganizerRoute = ({ children }) => {
    const { isAuthenticated, isOrganizer, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isOrganizer) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Access Denied
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            You need an organizer account to access this page.
                        </p>
                        <p className="mt-4 text-sm text-gray-500">
                            Only users with organizer privileges can create and manage events.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => window.history.back()}
                                className="text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                Go back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default OrganizerRoute;

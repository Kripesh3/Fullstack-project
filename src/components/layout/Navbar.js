import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin, isOrganizer } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-indigo-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <h1 className="text-white text-xl font-bold">EventEase</h1>
                        </Link>

                        {isAuthenticated && (
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link
                                    to="/"
                                    className="text-white hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Events
                                </Link>
                                <Link
                                    to="/my-events"
                                    className="text-white hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    My Events
                                </Link>
                                {isOrganizer && (
                                    <Link
                                        to="/create-event"
                                        className="text-white hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Create Event
                                    </Link>
                                )}
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="text-white hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Admin
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/profile"
                                    className="text-white hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    {user?.name}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-white hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-white hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-white text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

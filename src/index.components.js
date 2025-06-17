// Export all components for better organization
export { default as Login } from './components/auth/Login';
export { default as Register } from './components/auth/Register';
export { default as ForgotPassword } from './components/auth/ForgotPassword';
export { default as ProtectedRoute } from './components/auth/ProtectedRoute';

export { default as LoadingSpinner } from './components/common/LoadingSpinner';
export { default as EventCard } from './components/events/EventCard';
export { default as Navbar } from './components/layout/Navbar';

export { default as EventList } from './pages/EventList';
export { default as EventDetail } from './pages/EventDetail';
export { default as CreateEvent } from './pages/CreateEvent';
export { default as EditEvent } from './pages/EditEvent';
export { default as MyEvents } from './pages/MyEvents';
export { default as Profile } from './pages/Profile';
export { default as AdminDashboard } from './pages/admin/AdminDashboard';

export { AuthProvider, useAuth } from './contexts/AuthContext';
export * from './services/api';
export { default as api } from './config/api';

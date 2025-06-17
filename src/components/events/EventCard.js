import { useState } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const EventCard = ({ event, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleRegister = async () => {
        setLoading(true);
        try {
            await eventService.registerForEvent(event.id);
            onUpdate(); // Refresh the events list to show updated registration
        } catch (error) {
            console.error('Registration failed:', error);
            // You might want to show a toast or alert here
            alert('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUnregister = async () => {
        setLoading(true);
        try {
            await eventService.unregisterFromEvent(event.id);
            onUpdate(); // Refresh the events list to show updated registration
        } catch (error) {
            console.error('Unregistration failed:', error);
            // You might want to show a toast or alert here
            alert('Unregistration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isRegistered = event.attendees?.some(attendee => attendee.id === user?.id);
    const isEventOwner = event.organizer_id === user?.id;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {event.image && (
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                />
            )}

            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {event.category?.name || 'Uncategorized'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.status === 'approved' ? 'bg-green-100 text-green-800' :
                            event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                        }`}>
                        {event.status}
                    </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <Link to={`/events/${event.id}`} className="hover:text-indigo-600">
                        {event.title}
                    </Link>
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {event.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(event.date).toLocaleDateString()}
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        {event.attendees?.length || 0} registered
                    </span>

                    {user && !isEventOwner && event.status === 'approved' && (
                        <button
                            onClick={isRegistered ? handleUnregister : handleRegister}
                            disabled={loading}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isRegistered
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                } disabled:opacity-50`}
                        >
                            {loading ? 'Loading...' : isRegistered ? 'Unregister' : 'Register'}
                        </button>
                    )}

                    {!user && event.status === 'approved' && (
                        <span className="text-sm text-gray-500 italic">
                            Login to register
                        </span>
                    )}

                    {isEventOwner && (
                        <Link
                            to={`/events/${event.id}/edit`}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium"
                        >
                            Edit
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCard;

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [registering, setRegistering] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await eventService.getEvent(id);
                setEvent(response.data);
            } catch (error) {
                setError('Failed to fetch event details');
                console.error('Error fetching event:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const response = await eventService.getEvent(id);
            setEvent(response.data);
        } catch (error) {
            setError('Failed to fetch event details');
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        setRegistering(true);
        try {
            await eventService.registerForEvent(id);
            fetchEvent(); // Refresh event data
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setRegistering(false);
        }
    };

    const handleUnregister = async () => {
        setRegistering(true);
        try {
            await eventService.unregisterFromEvent(id);
            fetchEvent(); // Refresh event data
        } catch (error) {
            console.error('Unregistration failed:', error);
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || 'Event not found'}
                </div>
            </div>
        );
    }

    const isRegistered = event.registrations?.some(reg => reg.user_id === user?.id);
    const isEventOwner = event.created_by === user?.id;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {event.image && (
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-64 object-cover"
                    />
                )}

                <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                            {event.category?.name || 'Uncategorized'}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${event.status === 'approved' ? 'bg-green-100 text-green-800' :
                                event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                            }`}>
                            {event.status}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Details</h3>
                            <div className="space-y-2 text-gray-600">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {new Date(event.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {event.time}
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {event.location}
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {event.registrations?.length || 0} registered
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Actions</h3>
                            <div className="space-y-3">
                                {!isEventOwner && event.status === 'approved' && (
                                    <button
                                        onClick={isRegistered ? handleUnregister : handleRegister}
                                        disabled={registering}
                                        className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${isRegistered
                                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                            } disabled:opacity-50`}
                                    >
                                        {registering ? 'Loading...' : isRegistered ? 'Unregister from Event' : 'Register for Event'}
                                    </button>
                                )}

                                {isEventOwner && (
                                    <Link
                                        to={`/events/${event.id}/edit`}
                                        className="w-full block px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-center rounded-md text-sm font-medium"
                                    >
                                        Edit Event
                                    </Link>
                                )}

                                <Link
                                    to="/"
                                    className="w-full block px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-center rounded-md text-sm font-medium"
                                >
                                    Back to Events
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                        <div className="text-gray-600 whitespace-pre-wrap">
                            {event.description}
                        </div>
                    </div>

                    {event.registrations && event.registrations.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Registered Attendees</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {event.registrations.map((registration) => (
                                    <div key={registration.id} className="bg-gray-50 p-3 rounded-md">
                                        <p className="font-medium text-gray-900">{registration.user?.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Registered on {new Date(registration.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetail;

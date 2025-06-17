import { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import EventCard from '../components/events/EventCard';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('created'); // 'created' or 'registered'
    const { user } = useAuth();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await eventService.getEvents();
            // Handle paginated response - extract the data array
            const eventData = response.data?.data || response.data;
            // Ensure we always set an array, even if API returns something else
            setEvents(Array.isArray(eventData) ? eventData : []);
        } catch (error) {
            setError('Failed to fetch events');
            console.error('Error fetching events:', error);
            // Set empty array on error to prevent filter issues
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    // Ensure events is always an array before filtering
    const createdEvents = Array.isArray(events) ? events.filter(event => event.organizer_id === user?.id) : [];
    const registeredEvents = Array.isArray(events) ? events.filter(event =>
        event.attendees?.some(attendee => attendee.id === user?.id)
    ) : [];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">My Events</h1>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('created')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'created'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Events I Created ({createdEvents.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('registered')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'registered'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Events I'm Registered For ({registeredEvents.length})
                        </button>
                    </nav>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'created' && (
                    <div>
                        {createdEvents.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No events created</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating a new event.</p>
                                <div className="mt-6">
                                    <a
                                        href="/create-event"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Create Event
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {createdEvents.map((event) => (
                                    <EventCard key={event.id} event={event} onUpdate={fetchEvents} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'registered' && (
                    <div>
                        {registeredEvents.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No registered events</h3>
                                <p className="mt-1 text-sm text-gray-500">Browse events and register for ones you're interested in.</p>
                                <div className="mt-6">
                                    <a
                                        href="/"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Browse Events
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {registeredEvents.map((event) => (
                                    <EventCard key={event.id} event={event} onUpdate={fetchEvents} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyEvents;

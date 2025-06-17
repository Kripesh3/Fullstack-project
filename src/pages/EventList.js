import { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import EventCard from '../components/events/EventCard';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

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
    const filteredEvents = Array.isArray(events) ? events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || event.category?.name?.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    }) : [];

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
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Events</h1>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Categories</option>
                            <option value="conference">Conference</option>
                            <option value="workshop">Workshop</option>
                            <option value="meetup">Meetup</option>
                            <option value="webinar">Webinar</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} onUpdate={fetchEvents} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventList;

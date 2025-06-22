'use client';

import { useState, useEffect } from 'react';
import { Event } from '../../types';
import api from '../../lib/api';
import EventCard from './EventCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface EventListProps {
  limit?: number;
  categoryId?: number;
  userId?: number;
  showUserEvents?: boolean;
}

export default function EventList({ limit, categoryId, userId, showUserEvents }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [limit, categoryId, userId, showUserEvents]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let url = '/events';
      
      if (showUserEvents) {
        url = '/my-events';
      } else if (userId) {
        url = `/users/${userId}/events`;
      }

      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (categoryId) params.append('category_id', categoryId.toString());

      const response = await api.get(`${url}?${params.toString()}`);

      
      // Handle different response structures
      let eventsData = [];
      if (response.data.success && response.data.data) {
        // Paginated response structure
        if (response.data.data.data) {
          eventsData = response.data.data.data;
        } else if (Array.isArray(response.data.data)) {
          eventsData = response.data.data;
        }
      } else if (Array.isArray(response.data)) {
        eventsData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        eventsData = response.data.data;
      }
      
      setEvents(eventsData);
    } catch (error: any) {
      console.error('Events API Error:', error);
      setError(error.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchEvents}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!Array.isArray(events) || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No events found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

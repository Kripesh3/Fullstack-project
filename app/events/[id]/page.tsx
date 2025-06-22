'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Event } from '../../types';
import { useAuth } from '../../providers/AuthProvider';
import api from '../../lib/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { CalendarIcon, MapPinIcon, UserIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { formatPrice, getStatusColor } from '../../lib/utils';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState(false);
  const [attendLoading, setAttendLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${params.id}`);
      const eventData = response.data.data || response.data;
      setEvent(eventData);
      
      // Check if user is attending
      if (user && eventData.attendees) {
        setAttending(eventData.attendees.some((attendee: any) => attendee.id === user.id));
      }
    } catch (error: any) {
      toast.error('Failed to load event');
      router.push('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleAttend = async () => {
    if (!user) {
      toast.error('Please login to attend events');
      router.push('/auth/login');
      return;
    }

    setAttendLoading(true);
    try {
      if (attending) {
        await api.delete(`/events/${params.id}/unattend`);
        setAttending(false);
        toast.success('Successfully unregistered from event');
      } else {
        await api.post(`/events/${params.id}/attend`);
        setAttending(true);
        toast.success('Successfully registered for event');
      }
      // Refresh event data
      fetchEvent();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update attendance';
      toast.error(message);
    } finally {
      setAttendLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <button
            onClick={() => router.push('/events')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Event Image */}
          <div className="relative h-64 md:h-80">
            {event.image ? (
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', event.image);
                  // Hide the image element and show fallback
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">{event.title.charAt(0)}</span>
              </div>
            )}
            {!event.image && (
              <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">{event.title.charAt(0)}</span>
              </div>
            )}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {event.category?.name}
              </span>
              <span className="text-2xl font-bold text-indigo-600">
                {formatPrice(event.ticket_price)}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-3" />
                  <span>{event.formatted_date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-3" />
                  <span>{event.formatted_time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-3" />
                  <span>{event.location}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <UserIcon className="h-5 w-5 mr-3" />
                  <span>Organized by {event.organizer?.name}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CurrencyDollarIcon className="h-5 w-5 mr-3" />
                  <span>{formatPrice(event.ticket_price)}</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">{event.attendees_count || 0}</span> / {event.capacity} attendees
                </div>
              </div>
            </div>

            <div className="prose max-w-none mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About this event</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {event.status === 'approved' && !event.is_past && !event.is_full && (
                <button
                  onClick={handleAttend}
                  disabled={attendLoading}
                  className={`px-6 py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    attending
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {attendLoading
                    ? 'Processing...'
                    : attending
                    ? 'Unregister'
                    : 'Register for Event'
                  }
                </button>
              )}
              
              {event.is_past && (
                <span className="px-6 py-3 bg-gray-200 text-gray-600 rounded-md font-medium">
                  Event has ended
                </span>
              )}
              
              {event.is_full && !attending && (
                <span className="px-6 py-3 bg-red-200 text-red-600 rounded-md font-medium">
                  Event is full
                </span>
              )}
              
              <button
                onClick={() => router.push('/events')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
              >
                Back to Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

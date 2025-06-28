'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../lib/api';
import { Event } from '../types';
import { formatPrice, getStatusColor } from '../lib/utils';
import { 
  CalendarIcon, 
  MapPinIcon, 
  UserGroupIcon, 
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export default function MyEventsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }
    if (user && user.role !== 'organizer' && user.role !== 'admin') {
      if (user.role === 'user') {
        router.push('/attendee');
      } else {
        router.push('/attendee');
      }
      return;
    }
    if (user) {
      fetchMyEvents();
    }
  }, [user, loading, router]);

  const fetchMyEvents = async () => {
    try {
      let response;
      if (user?.role === 'admin') {
        // Admin can see all events
        response = await api.get('/admin/events');
      } else {
        // Organizer sees only their events
        response = await api.get('/my-events');
      }
      
      const eventsData = response.data.data?.data || response.data.data || response.data || [];
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoadingEvents(false);
    }
  };

  const deleteEvent = async (eventId: number) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}`);
      setEvents(events.filter(event => event.id !== eventId));
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  if (loading || loadingEvents) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.role === 'admin' ? 'All Events' : 'My Events'}
              </h1>
              <p className="text-gray-600 mt-2">
                {user.role === 'admin' 
                  ? 'Manage all events on the platform'
                  : 'Manage your created events'
                }
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/events/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Event
              </Link>
              <Link
                href={user.role === 'admin' ? '/admin' : '/organizer'}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    filter === status
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {status} ({events.filter(e => status === 'all' || e.status === status).length})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {getStatusIcon(event.status)}
                          <span className="ml-1">{event.status}</span>
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formatDate(event.date)} at {event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPinIcon className="mr-2 h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="mr-2 h-4 w-4" />
                          {event.attendees_count || 0} / {event.capacity} attendees
                        </div>
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-indigo-600">
                            {formatPrice(event.ticket_price)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/events/${event.id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                        title="View Event"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                      
                      {(user.role === 'admin' || event.organizer_id === user.id) && (
                        <>
                          <Link
                            href={`/events/${event.id}/edit`}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit Event"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </Link>
                          
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Event"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? 'Start by creating your first event'
                : `No ${filter} events found`
              }
            </p>
            <div className="mt-6">
              <Link
                href="/events/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

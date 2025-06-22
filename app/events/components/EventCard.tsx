'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Event } from '../../types';
import { CalendarIcon, MapPinIcon, UserIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { formatPrice, getStatusColor } from '../../lib/utils';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  // Safety checks for missing data
  if (!event || !event.id) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title || 'Event image'}
            fill
            className="object-cover"
            onError={(e) => {
              console.error('Event image failed to load:', event.image);
              // Hide the broken image and show fallback
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span class="text-white text-xl font-semibold">
                      ${(event.title || 'E').charAt(0).toUpperCase()}
                    </span>
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xl font-semibold">
              {(event.title || 'E').charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
            {event.status || 'pending'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
            {event.category?.name || 'Uncategorized'}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {event.title || 'Untitled Event'}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event.description || 'No description available'}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>{event.formatted_date || event.date} at {event.formatted_time || event.time}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span className="truncate">{event.location || 'Location TBD'}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <UserIcon className="h-4 w-4 mr-2" />
            <span>{event.organizer?.name || 'Unknown Organizer'}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
            <span>{formatPrice(event.ticket_price)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {event.attendees_count || 0} / {event.capacity || 0} attendees
          </span>
          <Link
            href={`/events/${event.id}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

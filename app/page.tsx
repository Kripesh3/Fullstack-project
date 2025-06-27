'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EventList from './events/components/EventList';
import HeroSection from './components/layout/HeroSection';
import { useAuth } from './providers/AuthProvider';
import { CalendarIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      let targetRoute = '/attendee'; // default
      if (user.role === 'admin') {
        targetRoute = '/admin';
      } else if (user.role === 'organizer') {
        targetRoute = '/organizer';
      } else if (user.role === 'user') {
        targetRoute = '/attendee';
      } else {
        targetRoute = '/attendee';
      }
      router.push(targetRoute);
    }
  }, [isAuthenticated, user, loading, router]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Don't render anything for authenticated users as they'll be redirected
  if (isAuthenticated && user) {
    return null;
  }

  // Show marketing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Amazing Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find and join events that match your interests. From conferences to concerts, workshops to festivals - there's something for everyone.
          </p>
        </div>

        <EventList limit={6} />
        
        <div className="text-center mt-12">
          <Link
            href="/events"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            View All Events
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose EventEase?
            </h2>
            <p className="text-xl text-gray-600">
              The best platform for discovering and organizing events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Discovery</h3>
              <p className="text-gray-600">
                Find events that match your interests with our smart search and recommendation system.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect & Network</h3>
              <p className="text-gray-600">
                Meet like-minded people and build meaningful connections at events that matter to you.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Grow Your Events</h3>
              <p className="text-gray-600">
                Organizers can reach a wider audience and manage events with our comprehensive tools.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-indigo-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of event lovers and organizers on EventEase
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/auth/register"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Sign Up Now
            </Link>
            <Link
              href="/events"
              className="bg-indigo-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-400 transition-colors border border-indigo-400"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

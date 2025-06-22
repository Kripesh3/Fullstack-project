'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function OrganizerDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Fix hydration issue
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log('🔍 Organizer Dashboard - Auth Check:', {
      loading,
      isAuthenticated,
      user: user ? { email: user.email, role: user.role } : null,
      token: mounted ? localStorage.getItem('auth_token') : 'Not mounted'
    });

    if (!loading && mounted) {
      if (!user || !isAuthenticated) {
        console.log('❌ No authenticated user, redirecting to login');
        router.push('/auth/login?redirect=/organizer');
        return;
      }
      if (user.role !== 'organizer') {
        console.log('❌ User role mismatch. Expected: organizer, Got:', user.role);
        router.push('/');
        return;
      }
      console.log('✅ User authenticated successfully as organizer');
    }
  }, [user, loading, isAuthenticated, router, mounted]);

  if (loading || !mounted) {
    return <LoadingSpinner />;
  }

  if (!user || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Redirecting to login...</h2>
          <p className="text-gray-600">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug info in top-right corner */}
      <div className="fixed top-4 right-4 bg-black text-white p-2 rounded text-xs max-w-xs z-50">
        <div><strong>Auth Status:</strong></div>
        <div>User: {user.email}</div>
        <div>Role: {user.role}</div>
        <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      </div>

      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Organizer Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {user.name}! Manage your events here.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/events/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Create Event
              </Link>
              <Link
                href="/my-events"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                My Events
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Events</h3>
            <p className="text-3xl font-bold text-indigo-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Attendees</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Events</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">$0.00</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/events/create"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900">Create New Event</h3>
                <p className="text-sm text-gray-600 mt-1">Start organizing your next event</p>
              </Link>
              <Link
                href="/my-events"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900">Manage Events</h3>
                <p className="text-sm text-gray-600 mt-1">View and edit your existing events</p>
              </Link>
              <Link
                href="/profile"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900">Profile Settings</h3>
                <p className="text-sm text-gray-600 mt-1">Update your organizer profile</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

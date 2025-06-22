'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../lib/api';
import { useConfirmation } from '../hooks/useConfirmation';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalAttendees: number;
  pendingEvents: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  status: string;
  attendees_count: number;
  organizer: {
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const confirmation = useConfirmation();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalAttendees: 0,
    pendingEvents: 0,
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats
      const dashboardResponse = await api.get('/admin/dashboard');
      
      if (dashboardResponse.data.success) {
        setStats(dashboardResponse.data.data);
      }

      // Fetch recent users - handle paginated response
      const usersResponse = await api.get('/admin/users', { params: { limit: 5 } });
      
      if (usersResponse.data.success) {
        // The API returns paginated data, so we need to access data.data
        const usersData = usersResponse.data.data.data || usersResponse.data.data;
        setRecentUsers(Array.isArray(usersData) ? usersData.slice(0, 5) : []);
      }

      // Fetch pending events - handle paginated response
      const eventsResponse = await api.get('/admin/events', { params: { status: 'pending', limit: 5 } });
      
      if (eventsResponse.data.success) {
        // The API returns paginated data, so we need to access data.data
        const eventsData = eventsResponse.data.data.data || eventsResponse.data.data;
        setPendingEvents(Array.isArray(eventsData) ? eventsData.slice(0, 5) : []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const approveEvent = async (eventId: number) => {
    try {
      const response = await api.put(`/admin/events/${eventId}/approve`);

      if (response.data.success) {
        setPendingEvents(pendingEvents.filter(event => event.id !== eventId));
        setStats(prev => ({ ...prev, pendingEvents: prev.pendingEvents - 1 }));
        toast.success('Event approved successfully');
      } else {
        toast.error('Failed to approve event');
      }
    } catch (error) {
      console.error('Error approving event:', error);
      toast.error('Error approving event');
    }
  };

  const rejectEvent = async (eventId: number) => {
    try {
      const response = await api.put(`/admin/events/${eventId}/reject`);

      if (response.data.success) {
        setPendingEvents(pendingEvents.filter(event => event.id !== eventId));
        setStats(prev => ({ ...prev, pendingEvents: prev.pendingEvents - 1 }));
        toast.success('Event rejected successfully');
      } else {
        toast.error('Failed to reject event');
      }
    } catch (error) {
      console.error('Error rejecting event:', error);
      toast.error('Error rejecting event');
    }
  };

  if (loading || loadingData) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  if (user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/admin/users')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 515 0z" />
                </svg>
                Users
              </button>
              <button
                onClick={() => router.push('/admin/events')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
                </svg>
                Events
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 overflow-hidden shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 515 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-blue-100">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 overflow-hidden shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-green-100">Total Events</p>
                  <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 overflow-hidden shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-purple-100">Total Attendees</p>
                  <p className="text-2xl font-bold text-white">{stats.totalAttendees}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 overflow-hidden shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-orange-100">Pending Events</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingEvents}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white shadow-lg rounded-xl">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
              <button
                onClick={() => router.push('/admin/users')}
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                View all
              </button>
            </div>
            <div className="p-6">
              {recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'organizer' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-500 mt-2">No recent users</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Events */}
          <div className="bg-white shadow-lg rounded-xl">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Pending Events</h2>
              <button
                onClick={() => router.push('/admin/events')}
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                View all
              </button>
            </div>
            <div className="p-6">
              {pendingEvents.length > 0 ? (
                <div className="space-y-4">
                  {pendingEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">by {event.organizer.name}</p>
                          <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => approveEvent(event.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectEvent(event.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 mt-2">No pending events</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

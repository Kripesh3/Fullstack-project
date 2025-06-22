'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useConfirmationDialog } from '../../providers/ConfirmationProvider';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../lib/api';
import { toast } from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  banned: boolean;
  created_at: string;
  events_count?: number;
  attended_events_count?: number;
}

export default function AdminUsers() {
  const { user, loading } = useAuth();
  const { showConfirmation } = useConfirmationDialog();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Remove automatic redirects - let the layout handle authentication
    // if (!loading && !user) {
    //   router.push('/auth/login');
    // } else if (user && user.role !== 'admin') {
    //   router.push('/');
    // }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user, filter]);

  const fetchUsers = async () => {
    try {
      const params: any = {};
      
      if (filter !== 'all') {
        params.role = filter;
      }

      const response = await api.get('/admin/users', { params });

      if (response.data.success) {
        // Handle paginated response - the actual users are in data.data
        const usersData = response.data.data.data || response.data.data;
        setUsers(Array.isArray(usersData) ? usersData : []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const banUser = async (userId: number) => {
    const confirmed = await showConfirmation({
      title: 'Ban User',
      message: 'Are you sure you want to ban this user? They will not be able to access the platform.',
      confirmText: 'Ban User',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      const response = await api.put(`/admin/users/${userId}/ban`);

      if (response.data.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, banned: true, status: 'banned' } : user
        ));
        toast.success('User banned successfully');
      } else {
        toast.error('Failed to ban user');
      }
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Error banning user');
    }
  };

  const unbanUser = async (userId: number) => {
    try {
      const response = await api.put(`/admin/users/${userId}/unban`);

      if (response.data.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, banned: false, status: 'active' } : user
        ));
        toast.success('User unbanned successfully');
      } else {
        toast.error('Failed to unban user');
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast.error('Error unbanning user');
    }
  };

  const deleteUser = async (userId: number) => {
    const confirmed = await showConfirmation({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone and will permanently remove all their data.',
      confirmText: 'Delete User',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      const response = await api.delete(`/admin/users/${userId}`);

      if (response.data.success) {
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully');
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading || loadingUsers) {
    return <LoadingSpinner />;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage users, roles, and permissions</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Users</option>
                <option value="admin">Admins</option>
                <option value="organizer">Organizers</option>
                <option value="user">Users</option>
              </select>
            </div>
            <div className="flex-1 max-w-lg">
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Users ({filteredUsers.length})
            </h2>
          </div>
          
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((userData) => (
                    <tr key={userData.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{userData.name}</div>
                          <div className="text-sm text-gray-500">{userData.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          userData.role === 'admin' ? 'bg-red-100 text-red-800' :
                          userData.role === 'organizer' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {userData.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          userData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {userData.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userData.role === 'organizer' && (
                          <div>Events: {userData.events_count || 0}</div>
                        )}
                        {userData.role === 'user' && (
                          <div>Attended: {userData.attended_events_count || 0}</div>
                        )}
                        {userData.role === 'admin' && (
                          <div>Admin</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(userData.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {(!userData.banned && userData.status !== 'banned') ? (
                            <button
                              onClick={() => banUser(userData.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                            >
                              Ban
                            </button>
                          ) : (
                            <button
                              onClick={() => unbanUser(userData.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                            >
                              Unban
                            </button>
                          )}
                          {userData.id !== user.id && (
                            <button
                              onClick={() => deleteUser(userData.id)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

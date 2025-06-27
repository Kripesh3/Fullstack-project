'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function DebugPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    addLog('DebugPage mounted');
    addLog(`Loading: ${loading}`);
    addLog(`IsAuthenticated: ${isAuthenticated}`);
    addLog(`User: ${user ? JSON.stringify(user) : 'null'}`);
  }, [loading, isAuthenticated, user]);

  const testAdminRedirect = () => {
    addLog('Testing admin redirect...');
    if (user?.role === 'admin') {
      addLog('User is admin, redirecting to /admin');
      router.push('/admin');
    } else {
      addLog(`User role is: ${user?.role}, cannot access admin`);
    }
  };

  const checkUserRoles = () => {
    addLog('Current user data:');
    addLog(`- ID: ${user?.id}`);
    addLog(`- Name: ${user?.name}`);
    addLog(`- Email: ${user?.email}`);
    addLog(`- Role: ${user?.role}`);
    addLog(`- Full user object: ${JSON.stringify(user)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Debug Page</h1>
          
          <div className="space-y-4 mb-6">
            <button
              onClick={checkUserRoles}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Check User Data
            </button>
            
            <button
              onClick={testAdminRedirect}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 ml-4"
            >
              Test Admin Redirect
            </button>

            <button
              onClick={() => router.push('/admin')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 ml-4"
            >
              Force Navigate to Admin
            </button>

            <button
              onClick={() => router.push('/profile')}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 ml-4"
            >
              Go to Profile
            </button>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Debug Logs:</h2>
            <div className="bg-gray-100 p-4 rounded-md h-96 overflow-y-auto">
              <pre className="text-sm">
                {logs.join('\n')}
              </pre>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Current State:</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
                <p><strong>User Role:</strong> {user?.role || 'None'}</p>
              </div>
              <div>
                <p><strong>User ID:</strong> {user?.id || 'None'}</p>
                <p><strong>User Email:</strong> {user?.email || 'None'}</p>
                <p><strong>User Name:</strong> {user?.name || 'None'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useAuth } from '../providers/AuthProvider';
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function AuthDebug() {
  const { user, loading, isAuthenticated, login } = useAuth();
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    
    setTokenInfo({
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : null,
      savedUser: savedUser ? JSON.parse(savedUser) : null,
    });
  }, [user]);

  const testAdminAPI = async () => {
    try {
      console.log('Auth Debug: Testing admin API...');
      const response = await api.get('/admin/dashboard');
      console.log('Auth Debug: Admin API response:', response.data);
      alert('Admin API test successful! Check console for details.');
    } catch (error) {
      console.error('Auth Debug: Admin API test failed:', error);
      alert('Admin API test failed! Check console for details.');
    }
  };

  const handleQuickAdminLogin = async () => {
    try {
      console.log('Auth Debug: Starting quick admin login...');
      const result = await login('admin@example.com', 'password');
      console.log('Auth Debug: Login result:', result);
      
      // Force a small delay and then refresh token info
      setTimeout(() => {
        const token = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user');
        
        setTokenInfo({
          hasToken: !!token,
          tokenPreview: token ? token.substring(0, 20) + '...' : null,
          savedUser: savedUser ? JSON.parse(savedUser) : null,
        });
      }, 1000);
    } catch (error) {
      console.error('Quick admin login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Debug</h1>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">AuthProvider State</h2>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>User:</strong></p>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">LocalStorage Info</h2>
            <div className="space-y-2">
              <p><strong>Has Token:</strong> {tokenInfo?.hasToken ? 'Yes' : 'No'}</p>
              <p><strong>Token Preview:</strong> {tokenInfo?.tokenPreview || 'None'}</p>
              <p><strong>Saved User:</strong></p>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(tokenInfo?.savedUser, null, 2)}
              </pre>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-x-4">
              <button
                onClick={handleQuickAdminLogin}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Quick Admin Login
              </button>
              <button
                onClick={testAdminAPI}
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
              >
                Test Admin API
              </button>
              <button
                onClick={() => window.location.href = '/admin'}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Go to Admin Dashboard
              </button>
              <button
                onClick={() => window.location.href = '/auth/login'}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Go to Login
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Clear Storage & Reload
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Real-time Debug</h2>
            <div className="space-y-2">
              <p><strong>Current Time:</strong> {new Date().toLocaleTimeString()}</p>
              <p><strong>User Role:</strong> {user?.role || 'None'}</p>
              <p><strong>User Name:</strong> {user?.name || 'None'}</p>
              <p><strong>Can Access Admin:</strong> {user?.role === 'admin' ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

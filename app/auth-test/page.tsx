'use client';

import { useAuth } from '../providers/AuthProvider';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import api from '../lib/api';

export default function AuthTestPage() {
  const { user, login, logout, loading, isAuthenticated } = useAuth();
  const [loginData, setLoginData] = useState({ email: 'organizer@eventease.com', password: 'password123' });
  const [apiTest, setApiTest] = useState({ loading: false, result: '', error: '' });
  const [mounted, setMounted] = useState(false);

  // Fix hydration issue
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleQuickLogin = async () => {
    try {
      const result = await login(loginData.email, loginData.password);
      console.log('Login result:', result);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const testApiCall = async () => {
    setApiTest({ loading: true, result: '', error: '' });
    try {
      const response = await api.get('/user');
      setApiTest({ 
        loading: false, 
        result: JSON.stringify(response.data, null, 2), 
        error: '' 
      });
    } catch (error: any) {
      setApiTest({ 
        loading: false, 
        result: '', 
        error: error.response?.data?.message || error.message || 'Unknown error'
      });
    }
  };

  const checkTokenDirectly = () => {
    if (!mounted) return;
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    console.log('Direct token check:', { token, user });
    alert(`Token: ${token ? 'Present' : 'Missing'}\nUser: ${user ? 'Present' : 'Missing'}`);
  };

  const setTestAuthState = () => {
    if (!mounted) return;
    // Manually set auth state for testing
    const testUser = {
      id: 4,
      name: "Event Organizer",
      email: "organizer@eventease.com",
      role: "organizer",
      phone: null,
      bio: null,
      avatar: null,
      banned: false,
      created_at: "2025-06-22T04:09:01.000000Z",
      updated_at: "2025-06-22T04:09:01.000000Z",
      avatar_public_id: null
    };
    const testToken = "12|46EsVGnjbEqM0mRxt9svakt5XMGWnbQt9STrksHx37cf3cf6";
    
    localStorage.setItem('auth_token', testToken);
    localStorage.setItem('user', JSON.stringify(testUser));
    
    alert('Test auth state set! Reload the page to see changes.');
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Auth State</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
            <div><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
            <div><strong>User:</strong> {user ? `${user.email} (${user.role})` : 'None'}</div>
            <div><strong>Token in localStorage:</strong> {mounted ? (localStorage.getItem('auth_token') ? 'Present' : 'Missing') : 'Loading...'}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            {!isAuthenticated ? (
              <div className="space-y-4">
                <button
                  onClick={handleQuickLogin}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 mr-4"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Quick Login (Organizer)'}
                </button>
                <button
                  onClick={setTestAuthState}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 mr-4"
                >
                  Set Test Auth
                </button>
                <button
                  onClick={checkTokenDirectly}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 mr-4"
                >
                  Check Token
                </button>
                <Link
                  href="/auth/login"
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 inline-block"
                >
                  Go to Login Page
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <button
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mr-4"
                  >
                    Logout
                  </button>
                  <button
                    onClick={testApiCall}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 mr-4"
                    disabled={apiTest.loading}
                  >
                    {apiTest.loading ? 'Testing...' : 'Test API Call'}
                  </button>
                  <button
                    onClick={checkTokenDirectly}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 mr-4"
                  >
                    Check Token
                  </button>
                </div>
                <div>
                  <Link
                    href="/organizer"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 inline-block mr-4"
                  >
                    Go to Organizer Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
                  >
                    Go to Profile
                  </Link>
                </div>
              </div>
            )}

            {/* API Test Results */}
            {(apiTest.result || apiTest.error) && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">API Test Result:</h3>
                {apiTest.error ? (
                  <div className="text-red-600">Error: {apiTest.error}</div>
                ) : (
                  <pre className="text-sm text-green-600 whitespace-pre-wrap">{apiTest.result}</pre>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/organizer" className="block p-3 bg-gray-100 rounded text-center hover:bg-gray-200">
              Organizer Dashboard
            </Link>
            <Link href="/attendee" className="block p-3 bg-gray-100 rounded text-center hover:bg-gray-200">
              Attendee Dashboard
            </Link>
            <Link href="/profile" className="block p-3 bg-gray-100 rounded text-center hover:bg-gray-200">
              Profile Page
            </Link>
            <Link href="/events" className="block p-3 bg-gray-100 rounded text-center hover:bg-gray-200">
              Events Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useAuth } from '../providers/AuthProvider';
import { useEffect, useState } from 'react';

export default function DebugAuthPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const [localStorageInfo, setLocalStorageInfo] = useState<any>({});
  const [cookieInfo, setCookieInfo] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocalStorageInfo({
        auth_token: localStorage.getItem('auth_token'),
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user'),
      });
      setCookieInfo(document.cookie);
    }
  }, []);

  const clearEverything = () => {
    // Clear localStorage
    localStorage.clear();
    
    // Clear specific items
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear cookies
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost;";
    }
    
    // Clear session storage too
    sessionStorage.clear();
    
    alert('Everything cleared! Reloading...');
    window.location.reload();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Auth State</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="font-bold">Auth Provider State:</h3>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? JSON.stringify(user) : 'None'}</p>
        <p><strong>Current Path:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'Unknown'}</p>
      </div>

      <div className="bg-yellow-100 p-4 rounded mb-4">
        <h3 className="font-bold">localStorage:</h3>
        <pre>{JSON.stringify(localStorageInfo, null, 2)}</pre>
      </div>

      <div className="bg-blue-100 p-4 rounded mb-4">
        <h3 className="font-bold">Cookies:</h3>
        <p>{cookieInfo || 'No cookies'}</p>
      </div>
      
      <div className="space-x-4">
        <button 
          onClick={clearEverything}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Everything & Reload
        </button>
        
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Go to Home Page
        </button>
      </div>
    </div>
  );
}

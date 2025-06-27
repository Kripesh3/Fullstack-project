'use client';

import { useState } from 'react';

export default function ClearStoragePage() {
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState('');

  const clearStorage = async () => {
    setIsClearing(true);
    setMessage('');
    
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear any cookies (if needed)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      setMessage('Storage cleared successfully!');
    } catch (error) {
      setMessage('Error clearing storage: ' + (error as Error).message);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            🗑️ Clear Storage
          </h1>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-600 text-lg">⚠️</div>
            <div className="text-sm text-yellow-800">
              This will clear all stored data including login sessions, preferences, and cached data.
            </div>
          </div>
          
          <button
            onClick={clearStorage}
            disabled={isClearing}
            className={`w-full py-2 px-4 rounded-lg font-medium ${
              isClearing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isClearing ? 'Clearing...' : 'Clear All Storage'}
          </button>
          
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-800 border border-red-200' 
                : 'bg-green-50 text-green-800 border border-green-200'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
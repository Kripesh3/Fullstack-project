'use client';

import { useState, useEffect } from 'react';

export default function ApiTestPage() {
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      setApiStatus('Testing connection...');
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
      
      if (response.ok) {
        const data = await response.json();
        setApiResponse(data);
        setApiStatus('✅ API Connection Successful');
      } else {
        setApiStatus('❌ API Connection Failed');
        setError(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setApiStatus('❌ API Connection Failed');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            API Connection Test
          </h1>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">API URL:</h3>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_API_URL}
              </code>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Status:</h3>
              <p className="text-lg">{apiStatus}</p>
            </div>
            
            {error && (
              <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-red-700 mb-2">Error:</h3>
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            {apiResponse && (
              <div className="p-4 border border-green-300 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-700 mb-2">Response:</h3>
                <pre className="text-sm text-green-600 whitespace-pre-wrap">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )}
            
            <button
              onClick={testApiConnection}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
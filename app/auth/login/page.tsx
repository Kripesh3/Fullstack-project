'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../providers/AuthProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  
  // Try-catch around useAuth to see if this is causing the issue
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    console.error('Error using AuthProvider:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Authentication Error</h2>
            <p className="text-gray-600">Error loading authentication context</p>
          </div>
        </div>
      </div>
    );
  }

  const { login, isAuthenticated, user } = authContext;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle redirection after successful login
  useEffect(() => {
    if (justLoggedIn && isAuthenticated && user) {
      const redirect = searchParams.get('redirect');
      if (redirect) {
        router.push(redirect);
      } else {
        // Redirect based on user role
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
      setJustLoggedIn(false);
    }
  }, [justLoggedIn, isAuthenticated, user, router, searchParams]);

  // Redirect if already authenticated - but only on initial load
  useEffect(() => {
    if (isAuthenticated && !justLoggedIn) {
      // Only redirect if there's a specific redirect parameter, not on successful login
      const redirect = searchParams.get('redirect');
      if (redirect) {
        router.push(redirect);
      }
    }
  }, [isAuthenticated, router, searchParams, justLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      setJustLoggedIn(true);
      await login(email, password);
      // The useEffect above will handle the redirection
    } catch (error) {
      console.error('Login page: Login failed', error);
      setJustLoggedIn(false);
      // Error is handled in the AuthProvider
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <span className="text-gray-400 text-sm">🙈</span>
                ) : (
                  <span className="text-gray-400 text-sm">👁️</span>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

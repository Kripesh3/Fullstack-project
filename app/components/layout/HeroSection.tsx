'use client';

import Link from 'next/link';
import { useAuth } from '../../providers/AuthProvider';

export default function HeroSection() {
  const { isAuthenticated, user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/events';
    
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'organizer':
        return '/organizer';
      case 'attendee':
      case 'user':
        return '/attendee';
      default:
        return '/events';
    }
  };

  const getNavItems = () => {
    if (!isAuthenticated || !user) {
      return (
        <>
          <Link href="/events" className="font-medium text-white hover:text-gray-300">
            Events
          </Link>
          <Link href="/auth/login" className="font-medium text-white hover:text-gray-300">
            Log in
          </Link>
          <Link
            href="/auth/register"
            className="font-medium bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-md"
          >
            Sign up
          </Link>
        </>
      );
    }

    const commonItems = (
      <>
        <Link href="/events" className="font-medium text-white hover:text-gray-300">
          Events
        </Link>
        <Link href={getDashboardLink()} className="font-medium text-white hover:text-gray-300">
          Dashboard
        </Link>
        <Link href="/profile" className="font-medium text-white hover:text-gray-300">
          Profile
        </Link>
      </>
    );

    switch (user.role) {
      case 'admin':
        return (
          <>
            {commonItems}
            <Link href="/admin/users" className="font-medium text-white hover:text-gray-300">
              Manage Users
            </Link>
            <Link href="/admin/events" className="font-medium text-white hover:text-gray-300">
              Manage Events
            </Link>
          </>
        );
      case 'organizer':
        return (
          <>
            {commonItems}
            <Link href="/events/create" className="font-medium text-white hover:text-gray-300">
              Create Event
            </Link>
          </>
        );
      default:
        return commonItems;
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-gradient-to-r from-indigo-600 to-purple-600 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
            <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start" aria-label="Global">
              <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                <div className="flex items-center justify-between w-full md:w-auto">
                  <Link href="/" className="text-2xl font-bold text-white">
                    EventEase
                  </Link>
                </div>
              </div>
              <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
                {getNavItems()}
              </div>
            </nav>
          </div>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">
                  {isAuthenticated ? 'Welcome back!' : 'Discover & Join'}
                </span>{' '}
                <span className="block text-yellow-300 xl:inline">
                  {isAuthenticated ? 'Amazing Events' : 'Amazing Events'}
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                {isAuthenticated 
                  ? 'Ready to discover new experiences? Browse events or create your own to share with the community.'
                  : 'Find events that match your interests, connect with like-minded people, and create unforgettable experiences.'
                }
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    href={isAuthenticated ? getDashboardLink() : "/events"}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    {isAuthenticated ? "Go to Dashboard" : "Browse Events"}
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    href={isAuthenticated ? "/events" : "/auth/register"}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 md:py-4 md:text-lg md:px-10"
                  >
                    {isAuthenticated ? "Browse Events" : "Sign Up Free"}
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="People at an event"
        />
      </div>
    </div>
  );
}

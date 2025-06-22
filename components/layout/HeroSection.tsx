'use client';

import Link from 'next/link';
import { useAuth } from '../../app/providers/AuthProvider';

export default function HeroSection() {
  const { isAuthenticated, user } = useAuth();

  const getDashboardRoute = () => {
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
            Login
          </Link>
          <Link href="/auth/register" className="font-medium text-white hover:text-gray-300">
            Register
          </Link>
        </>
      );
    }

    return (
      <>
        <Link href="/events" className="font-medium text-white hover:text-gray-300">
          Events
        </Link>
        <Link href={getDashboardRoute()} className="font-medium text-white hover:text-gray-300">
          Dashboard
        </Link>
        <Link href="/profile" className="font-medium text-white hover:text-gray-300">
          Profile
        </Link>
      </>
    );
  };

  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black opacity-20" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link href="/" className="text-white">
                <span className="sr-only">EventEase</span>
                <h1 className="text-2xl font-bold">EventEase</h1>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-8">
              {getNavItems()}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div className="sm:text-center lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Discover Amazing</span>{' '}
              <span className="block text-yellow-400 xl:inline">Events</span>
            </h1>
            <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Find and join incredible events in your area. From conferences to concerts, 
              workshops to parties - discover experiences that inspire and connect you.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <Link
                  href="/events"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition duration-300"
                >
                  Browse Events
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                {isAuthenticated && user?.role === 'organizer' ? (
                  <Link
                    href="/events/create"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-500 hover:bg-purple-600 md:py-4 md:text-lg md:px-10 transition duration-300"
                  >
                    Create Event
                  </Link>
                ) : isAuthenticated ? (
                  <Link
                    href={getDashboardRoute()}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-500 hover:bg-purple-600 md:py-4 md:text-lg md:px-10 transition duration-300"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/auth/register"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-500 hover:bg-purple-600 md:py-4 md:text-lg md:px-10 transition duration-300"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Join thousands of event enthusiasts
            </h2>
            <p className="mt-3 text-xl text-gray-300 sm:mt-4">
              EventEase connects people through memorable experiences
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-300">
                Events Created
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                1000+
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-300">
                Happy Attendees
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                50K+
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-300">
                Cities Covered
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                25+
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Features Preview */}
      <div className="relative z-10 py-16 bg-black bg-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Why Choose EventEase?
            </h2>
            <p className="mt-4 text-xl text-gray-300">
              Everything you need to discover, create, and manage events
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-400 text-purple-600 mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-white">Easy Discovery</h3>
              <p className="mt-2 text-base text-gray-300">
                Find events that match your interests with our smart search and filtering
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-400 text-purple-600 mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-white">Simple Registration</h3>
              <p className="mt-2 text-base text-gray-300">
                Register for events with just a few clicks and manage your attendance
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-400 text-purple-600 mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-white">Event Management</h3>
              <p className="mt-2 text-base text-gray-300">
                Create and manage your own events with powerful organizer tools
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

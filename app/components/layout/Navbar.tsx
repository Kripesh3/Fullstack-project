'use client';

import Link from 'next/link';
import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  CalendarIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  PlusIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'organizer':
        return '/organizer';
      case 'attendee':
      case 'user':
        return '/attendee';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-indigo-600">EventEase</h1>
            </Link>
            
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link
                href="/events"
                className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <CalendarIcon className="w-4 h-4 mr-1" />
                Events
              </Link>
              
              {isAuthenticated && user && (
                <>
                  <Link
                    href={getDashboardLink()}
                    className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  
                  {user.role === 'organizer' && (
                    <>
                      <Link
                        href="/events/create"
                        className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                      >
                        <PlusIcon className="w-4 h-4 mr-1" />
                        Create Event
                      </Link>
                      <Link
                        href="/my-events"
                        className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        My Events
                      </Link>
                    </>
                  )}
                  
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <Cog6ToothIcon className="w-4 h-4 mr-1" />
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <UserIcon className="w-4 h-4 mr-1" />
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

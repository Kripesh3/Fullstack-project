'use client';

import { useState, useEffect } from 'react';
import { EventCategory } from './types';
import api from '../lib/api';
import EventList from './components/EventList';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function EventsPage() {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Events</h1>
          <p className="text-lg text-gray-600">
            Discover and join amazing events happening around you.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors $&#123;
                selectedCategory === undefined
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors $&#123;
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Events List */}
        <EventList categoryId={selectedCategory} />
      </div>
    </div>
  );
}

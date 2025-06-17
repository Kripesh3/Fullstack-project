import { useState, useEffect } from 'react';
import { adminService, categoryService } from '../../services/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('events');
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Category form
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        if (activeTab === 'events') {
            fetchEvents();
        } else if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'categories') {
            fetchCategories();
        }
    }, [activeTab]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await adminService.getEvents();
            // Handle potential paginated response - extract the data array
            const eventData = response.data?.data || response.data;
            // Ensure we always set an array
            setEvents(Array.isArray(eventData) ? eventData : []);
        } catch (error) {
            setError('Failed to fetch events');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminService.getUsers();
            // Handle potential paginated response - extract the data array
            const userData = response.data?.data || response.data;
            // Ensure we always set an array
            setUsers(Array.isArray(userData) ? userData : []);
        } catch (error) {
            setError('Failed to fetch users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await categoryService.getCategories();
            // Handle potential paginated response - extract the data array
            const categoryData = response.data?.data || response.data;
            // Ensure we always set an array
            setCategories(Array.isArray(categoryData) ? categoryData : []);
        } catch (error) {
            setError('Failed to fetch categories');
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveEvent = async (eventId) => {
        try {
            await adminService.approveEvent(eventId);
            setMessage('Event approved successfully');
            fetchEvents();
        } catch (error) {
            setError('Failed to approve event');
        }
    };

    const handleRejectEvent = async (eventId) => {
        try {
            await adminService.rejectEvent(eventId);
            setMessage('Event rejected successfully');
            fetchEvents();
        } catch (error) {
            setError('Failed to reject event');
        }
    };

    const handleBanUser = async (userId) => {
        try {
            await adminService.banUser(userId);
            setMessage('User banned successfully');
            fetchUsers();
        } catch (error) {
            setError('Failed to ban user');
        }
    };

    const handleWarnUser = async (userId) => {
        try {
            await adminService.warnUser(userId);
            setMessage('Warning sent to user');
            fetchUsers();
        } catch (error) {
            setError('Failed to warn user');
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            await categoryService.createCategory(newCategory);
            setMessage('Category created successfully');
            setNewCategory({ name: '', description: '' });
            fetchCategories();
        } catch (error) {
            setError('Failed to create category');
        }
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        try {
            await categoryService.updateCategory(editingCategory.id, editingCategory);
            setMessage('Category updated successfully');
            setEditingCategory(null);
            fetchCategories();
        } catch (error) {
            setError('Failed to update category');
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await categoryService.deleteCategory(categoryId);
                setMessage('Category deleted successfully');
                fetchCategories();
            } catch (error) {
                setError('Failed to delete category');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                    {['events', 'users', 'categories'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                    {message}
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Event Management</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Approve or reject pending events</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {events.map((event) => (
                                <li key={event.id} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-indigo-600 truncate">{event.title}</p>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {event.status}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-500">
                                                        {event.description.substring(0, 100)}...
                                                    </p>
                                                </div>
                                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                    <p>Created by {event.user?.name}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {event.status === 'pending' && (
                                            <div className="ml-4 flex space-x-2">
                                                <button
                                                    onClick={() => handleApproveEvent(event.id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRejectEvent(event.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">User Management</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage user accounts and permissions</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <li key={user.id} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-indigo-600 truncate">{user.name}</p>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                            user.status === 'active' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {user.role || user.status}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-500">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                    <p>Joined {new Date(user.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {user.role !== 'admin' && (
                                            <div className="ml-4 flex space-x-2">
                                                <button
                                                    onClick={() => handleWarnUser(user.id)}
                                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Warn
                                                </button>
                                                <button
                                                    onClick={() => handleBanUser(user.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Ban
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <div className="space-y-6">
                    {/* Create Category Form */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Category</h3>
                        <form onSubmit={handleCreateCategory} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCategory.name}
                                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <input
                                        type="text"
                                        value={newCategory.description}
                                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Create Category
                            </button>
                        </form>
                    </div>

                    {/* Categories List */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Existing Categories</h3>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {categories.map((category) => (
                                    <li key={category.id} className="px-4 py-4 sm:px-6">
                                        {editingCategory?.id === category.id ? (
                                            <form onSubmit={handleUpdateCategory} className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        value={editingCategory.name}
                                                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editingCategory.description}
                                                        onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="submit"
                                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingCategory(null)}
                                                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                                                    <p className="text-sm text-gray-500">{category.description}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setEditingCategory(category)}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCategory(category.id)}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

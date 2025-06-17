import api from '../config/api';

export const authService = {
    login: (email, password) =>
        api.post('/login', { email, password }),

    register: (name, email, password, password_confirmation) =>
        api.post('/register', { name, email, password, password_confirmation }),

    logout: () =>
        api.post('/logout'),

    forgotPassword: (email) =>
        api.post('/password/email', { email }),

    resetPassword: (token, email, password, password_confirmation) =>
        api.post('/password/reset', { token, email, password, password_confirmation })
};

export const userService = {
    getProfile: () =>
        api.get('/me'),

    updateProfile: (data) =>
        api.put('/me', data),

    changePassword: (current_password, password, password_confirmation) =>
        api.put('/me/password', { current_password, password, password_confirmation })
};

export const eventService = {
    getEvents: (params = {}) =>
        api.get('/events', { params }),

    getEvent: (id) =>
        api.get(`/events/${id}`),

    createEvent: (data) =>
        api.post('/events', data),

    updateEvent: (id, data) =>
        api.put(`/events/${id}`, data),

    deleteEvent: (id) =>
        api.delete(`/events/${id}`),

    registerForEvent: (id) =>
        api.post(`/events/${id}/register`),

    unregisterFromEvent: (id) =>
        api.delete(`/events/${id}/register`)
};

export const categoryService = {
    getCategories: () =>
        api.get('/categories'),

    createCategory: (data) =>
        api.post('/categories', data),

    updateCategory: (id, data) =>
        api.put(`/categories/${id}`, data),

    deleteCategory: (id) =>
        api.delete(`/categories/${id}`)
};

export const adminService = {
    getUsers: () =>
        api.get('/admin/users'),

    getEvents: () =>
        api.get('/admin/events'),

    approveEvent: (id) =>
        api.post(`/admin/events/${id}/approve`),

    rejectEvent: (id) =>
        api.post(`/admin/events/${id}/reject`),

    banUser: (id) =>
        api.post(`/admin/users/${id}/ban`),

    warnUser: (id) =>
        api.post(`/admin/users/${id}/warn`)
};

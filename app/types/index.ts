export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'organizer' | 'user' | 'attendee';
  phone?: string;
  avatar?: string;
  bio?: string;
  banned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  capacity: number;
  image?: string;
  image_url?: string;
  category_id: number;
  organizer_id: number;
  status: 'pending' | 'approved' | 'rejected';
  ticket_price: number;
  formatted_date: string;
  formatted_time: string;
  is_past: boolean;
  is_full: boolean;
  category: EventCategory;
  organizer: User;
  attendees?: User[];
  attendees_count?: number;
  created_at: string;
  updated_at: string;
}

export interface EventCategory {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  events_count?: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  capacity: number;
  category_id: number;
  image?: FileList;
  ticket_price: number;
}

export interface ProfileFormData {
  name: string;
  phone?: string;
  bio?: string;
  avatar?: FileList;
}

export interface ChangePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface DashboardStats {
  total_events: number;
  pending_events: number;
  approved_events: number;
  total_users: number;
  total_organizers: number;
  total_attendees: number;
  recent_events: Event[];
  recent_users: User[];
}

export interface TicketVerificationData {
  event_id: number;
  user_id: number;
}

// Form validation types
export interface ValidationErrors {
  [key: string]: string[];
}

// Filter types for events
export interface EventFilters {
  search?: string;
  category?: string;
  date?: string;
  location?: string;
  page?: number;
  per_page?: number;
}

// Notification types
export interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface AttendeeRegistration {
  event_id: number;
  user_id: number;
  registered_at: string;
  ticket_id?: string;
}

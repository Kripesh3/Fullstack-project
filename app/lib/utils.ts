/**
 * Utility functions for the EventEase application
 */

/**
 * Safely formats a price value, handling various input types
 * @param price - Price value that could be number, string, null, or undefined
 * @returns Formatted price string
 */
export const formatPrice = (price: number | string | null | undefined): string => {
  // Handle null, undefined, or empty values
  if (price === null || price === undefined || price === '') {
    return 'Free';
  }

  // Convert to number
  const numPrice = Number(price);
  
  // Handle invalid numbers
  if (isNaN(numPrice)) {
    return 'Free';
  }

  // Return formatted price
  return numPrice === 0 ? 'Free' : `$${numPrice.toFixed(2)}`;
};

/**
 * Formats a date string into a readable format
 * @param date - Date string
 * @returns Formatted date string
 */
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Formats a time string
 * @param time - Time string
 * @returns Formatted time string
 */
export const formatTime = (time: string): string => {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Gets the appropriate CSS classes for event status
 * @param status - Event status
 * @returns CSS class string
 */
export const getStatusColor = (status: string | undefined): string => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Truncates text to a specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validates if a string is a valid email
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

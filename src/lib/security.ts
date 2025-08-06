// Security utilities for input sanitization and validation

/**
 * Sanitizes text input by removing potentially harmful characters
 */
export const sanitizeText = (input: string): string => {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets to prevent XSS
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .substring(0, 2000); // Limit length
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validates government domain emails for admin accounts
 */
export const isGovernmentDomain = (email: string): boolean => {
  const governmentDomains = ['@municipal.gov', '@gov.in', '@city.gov'];
  return governmentDomains.some(domain => 
    email.toLowerCase().endsWith(domain)
  );
};

/**
 * Validates phone number format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

/**
 * Removes sensitive information from error messages
 */
export const sanitizeErrorMessage = (error: any): string => {
  if (!error) return 'An unexpected error occurred';
  
  const message = error.message || error.toString();
  
  // Remove potential database schema information
  return message
    .replace(/relation ".*?" does not exist/gi, 'Database table not found')
    .replace(/column ".*?" does not exist/gi, 'Invalid field')
    .replace(/duplicate key value violates unique constraint/gi, 'Duplicate entry')
    .replace(/password/gi, 'credentials')
    .replace(/auth\.users/gi, 'user table')
    .replace(/public\./gi, '')
    .substring(0, 200); // Limit error message length
};

/**
 * Rate limiting status check
 */
export const checkClientSideRateLimit = (
  actionType: string, 
  maxActions: number = 5, 
  windowMinutes: number = 60
): boolean => {
  const storageKey = `rate_limit_${actionType}`;
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  
  try {
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : { count: 0, windowStart: now };
    
    // Reset if window expired
    if (now - data.windowStart > windowMs) {
      data.count = 0;
      data.windowStart = now;
    }
    
    // Check if limit exceeded
    if (data.count >= maxActions) {
      return false;
    }
    
    // Increment count
    data.count++;
    localStorage.setItem(storageKey, JSON.stringify(data));
    
    return true;
  } catch {
    return true; // Allow action if localStorage fails
  }
};
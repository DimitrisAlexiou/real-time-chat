/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = ['/', '/auth/new-verification'];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes: string[] = [
	'/auth/register',
	'/auth/login',
	'/auth/error',
	'/auth/reset',
	'/auth/new-password',
];

/**
 * Prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix: string = '/api/auth';

/**
 * Default redirect route after a successful login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = '/settings';

export const protectedRoutes = ['/settings'];

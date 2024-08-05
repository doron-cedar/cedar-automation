import dotenv from 'dotenv';

dotenv.config();

export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
export const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;

// Derive the Frontend API URL from the publishable key
export const CLERK_FRONTEND_API = `https://${CLERK_PUBLISHABLE_KEY?.split('_')[1]}.clerk.accounts.dev`;

if (!CLERK_SECRET_KEY || !CLERK_PUBLISHABLE_KEY) {
  throw new Error('Clerk API keys are not set in the environment variables.');
}
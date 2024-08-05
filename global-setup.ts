import { clerkSetup } from '@clerk/testing/playwright';
import dotenv from 'dotenv';

declare global {
  interface Window {
    Clerk: any; // Adjust the type according to Clerk's actual type if known
  }
}

async function globalSetup() {
  dotenv.config();
  
  if (!process.env.CLERK_PUBLISHABLE_KEY) {
    throw new Error('CLERK_PUBLISHABLE_KEY is not set in the environment variables.');
  }

  await clerkSetup({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  });
}

export default globalSetup;

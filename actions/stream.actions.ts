'use server';

import { StreamClient } from '@stream-io/node-sdk';
import { currentUser } from '@clerk/nextjs/server';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error('User is not logged in');
  if (!apiKey) throw new Error('No API key provided');
  if (!apiSecret) throw new Error('No API Secret provided');

  // Initialize the Stream client
  const client = new StreamClient(apiKey, apiSecret);

  // Deprecated method - use with caution
  const exp = Math.floor(Date.now() / 1000) + 60 * 60; // Expiration time: 1 hour
  const issued = Math.floor(Date.now() / 1000) - 60; // Issued 1 minute in the past

  const token = client.createToken(user.id, exp, issued);

  return token;
};

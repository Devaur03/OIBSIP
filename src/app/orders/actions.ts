
'use server';

import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function getOrders(userId: string) {
  if (!userId) {
    throw new Error('User ID is required to fetch orders.');
  }

  try {
    const client = await clientPromise;
    const db = client.db('slicecrafter');
    const ordersCollection = db.collection('orders');

    // Find orders for the specific user and sort by most recent
    const orders = await ordersCollection
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .toArray();

    // The default `_id` is an ObjectId, which is not directly serializable
    // for passing from Server Components to Client Components.
    // We convert it to a string.
    return JSON.parse(JSON.stringify(orders));

  } catch (error) {
    console.error('Failed to fetch orders from database:', error);
    throw new Error('Could not retrieve orders.');
  }
}

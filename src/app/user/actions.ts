
'use server';

import clientPromise from '@/lib/mongodb';
import { InventoryItem } from '@/app/admin/actions';

interface UserData {
    uid: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: Date;
}

export async function getUserData(uid: string): Promise<UserData | null> {
    if (!uid) {
        return null;
    }

    try {
        const client = await clientPromise;
        const db = client.db('slicecrafter');
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ uid: uid });

        if (!user) {
            return null;
        }

        // Using JSON.parse(JSON.stringify(...)) to ensure the object is serializable
        // when passing from server to client components. It handles BSON types like ObjectId.
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error('Failed to fetch user data from MongoDB:', error);
        throw new Error('Could not retrieve user data.');
    }
}

export async function getInventoryForUser(): Promise<InventoryItem[]> {
  try {
    const client = await clientPromise;
    const db = client.db('slicecrafter');
    const inventoryCollection = db.collection('inventory');
    
    const inventory = await inventoryCollection.find({}).project({ name: 1, stock: 1 }).toArray();
    return JSON.parse(JSON.stringify(inventory));
  } catch (error) {
    console.error('Failed to fetch inventory for user:', error);
    throw new Error('Could not retrieve inventory.');
  }
}

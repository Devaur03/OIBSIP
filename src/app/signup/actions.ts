
'use server';

import clientPromise from '@/lib/mongodb';
import { z } from 'zod';

const signupSchema = z
  .object({
    name: z.string().min(2, { message: 'Name is too short' }),
    email: z.string().email({ message: 'Invalid email address' }),
    uid: z.string(),
  });

type SignupSchema = z.infer<typeof signupSchema>;


export async function createUserInDb(data: SignupSchema) {
  const validatedData = signupSchema.safeParse(data);

  if (!validatedData.success) {
    return { success: false, message: 'Invalid data' };
  }

  const { name, email, uid } = validatedData.data;

  try {
    const client = await clientPromise;
    const db = client.db('slicecrafter');
    await db.collection('users').insertOne({
      uid: uid,
      name: name,
      email: email,
      role: 'user', // Default role
      createdAt: new Date(),
    });
    return { success: true, message: 'User created successfully.' };
  } catch (mongoError) {
    console.error("Failed to save user to MongoDB", mongoError);
    return { success: false, message: "Account created, but couldn't save details. Please contact support." };
  }
}

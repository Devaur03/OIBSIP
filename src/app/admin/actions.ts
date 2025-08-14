
'use server';

import clientPromise from '@/lib/mongodb';
import { pizzaBases, pizzaSauces, cheeseTypes, veggieToppings, meatToppings, PizzaOption } from '@/lib/data';
import { ObjectId } from 'mongodb';

export interface InventoryItem {
    _id: string;
    name: string;
    type: 'base' | 'sauce' | 'cheese' | 'veggie' | 'meat';
    stock: number;
}

interface PizzaConfig {
  id: string;
  base: PizzaOption | null;
  sauce: PizzaOption | null;
  cheese: PizzaOption | null;
  veggies: PizzaOption[];
  meat: PizzaOption[];
  price: number;
}

export interface Order {
  _id: string;
  userId: string;
  cart: PizzaConfig[];
  totalPrice: number;
  paymentId: string;
  status: string;
  createdAt: string; 
}


export async function seedInventory() {
    try {
        const client = await clientPromise;
        const db = client.db('slicecrafter');
        const inventoryCollection = db.collection('inventory');

        await inventoryCollection.deleteMany({});

        const inventoryItems = [
            ...pizzaBases.map(i => ({ name: i.name, type: 'base', stock: 100 })),
            ...pizzaSauces.map(i => ({ name: i.name, type: 'sauce', stock: 100 })),
            ...cheeseTypes.map(i => ({ name: i.name, type: 'cheese', stock: 100 })),
            ...veggieToppings.map(i => ({ name: i.name, type: 'veggie', stock: 100 })),
            ...meatToppings.map(i => ({ name: i.name, type: 'meat', stock: 100 })),
        ];

        await inventoryCollection.insertMany(inventoryItems);

        return { success: true, message: 'Inventory seeded successfully.' };
    } catch (error) {
        console.error('Failed to seed inventory:', error);
        return { success: false, message: 'Failed to seed inventory.' };
    }
}


export async function getInventory(): Promise<InventoryItem[]> {
  try {
    const client = await clientPromise;
    const db = client.db('slicecrafter');
    const inventoryCollection = db.collection('inventory');
    
    const count = await inventoryCollection.countDocuments();
    if (count === 0) {
        console.log("Inventory is empty. Seeding database...");
        await seedInventory();
    }

    const inventory = await inventoryCollection.find({}).sort({ name: 1 }).toArray();
    return JSON.parse(JSON.stringify(inventory));
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    throw new Error('Could not retrieve inventory.');
  }
}

export async function updateStock(itemId: string, newStock: number) {
    try {
        const client = await clientPromise;
        const db = client.db('slicecrafter');
        const inventoryCollection = db.collection('inventory');

        if (newStock < 0) {
            return { success: false, message: 'Stock cannot be negative.' };
        }

        await inventoryCollection.updateOne(
            { _id: new ObjectId(itemId) },
            { $set: { stock: newStock } }
        );

        return { success: true, message: 'Stock updated.' };
    } catch (error) {
        console.error('Failed to update stock:', error);
        return { success: false, message: 'Failed to update stock.' };
    }
}

export async function getRecentOrders(): Promise<Order[]> {
    try {
        const client = await clientPromise;
        const db = client.db('slicecrafter');
        const ordersCollection = db.collection('orders');

        const orders = await ordersCollection
            .find({})
            .sort({ createdAt: -1 })
            .limit(20) // Get the last 20 orders for the admin view
            .toArray();

        return JSON.parse(JSON.stringify(orders));
    } catch (error) {
        console.error('Failed to fetch recent orders:', error);
        throw new Error('Could not retrieve recent orders.');
    }
}


export async function updateOrderStatus(orderId: string, status: string) {
    try {
        const client = await clientPromise;
        const db = client.db('slicecrafter');
        const ordersCollection = db.collection('orders');

        const validStatuses = ['In the Kitchen', 'On its way', 'Delivered'];
        if (!validStatuses.includes(status)) {
            return { success: false, message: 'Invalid status.' };
        }

        await ordersCollection.updateOne(
            { _id: new ObjectId(orderId) },
            { $set: { status: status } }
        );
        return { success: true, message: 'Order status updated.' };
    } catch (error) {
        console.error('Failed to update order status:', error);
        return { success: false, message: 'Failed to update order status.' };
    }
}

export async function getAdminEmail(): Promise<string> {
    try {
        const client = await clientPromise;
        const db = client.db('slicecrafter');
        const usersCollection = db.collection('users');

        const adminUser = await usersCollection.findOne({ role: 'admin' });

        if (adminUser && adminUser.email) {
            return adminUser.email;
        } else {
            console.warn("No admin user found in the database. Falling back to default email.");
            return "admin@example.com";
        }
    } catch (error) {
        console.error("Failed to fetch admin email from database:", error);
        // Fallback in case of a database error
        return "admin@example.com";
    }
}

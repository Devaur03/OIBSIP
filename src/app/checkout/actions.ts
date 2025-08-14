
'use server';

import Razorpay from 'razorpay';
import shortid from 'shortid';
import { z } from 'zod';
import clientPromise from '@/lib/mongodb';
import { PizzaOption } from '@/lib/data';
import { notifyAdminOnLowStock } from '@/ai/flows/low-stock-notifier';

const orderSchema = z.object({
    amount: z.number().positive(),
});

type OrderSchema = z.infer<typeof orderSchema>;

const pizzaOptionSchema = z.object({
    name: z.string(),
    price: z.number(),
});

const pizzaConfigSchema = z.object({
    id: z.string(),
    base: pizzaOptionSchema.nullable(),
    sauce: pizzaOptionSchema.nullable(),
    cheese: pizzaOptionSchema.nullable(),
    veggies: z.array(pizzaOptionSchema),
    meat: z.array(pizzaOptionSchema),
    price: z.number(),
});

type PizzaConfig = z.infer<typeof pizzaConfigSchema>;

const saveOrderSchema = z.object({
    userId: z.string(),
    cart: z.array(pizzaConfigSchema),
    totalPrice: z.number(),
    paymentId: z.string(),
});

type SaveOrderSchema = z.infer<typeof saveOrderSchema>;


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createOrder(data: OrderSchema) {
  const validatedData = orderSchema.safeParse(data);

  if (!validatedData.success) {
    throw new Error('Invalid data provided.');
  }

  const { amount } = validatedData.data;

  const amountInCents = Math.round(amount * 100);

  const options = {
    amount: amountInCents,
    currency: 'USD',
    receipt: `receipt_${shortid.generate()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    return null;
  }
}

async function updateInventoryAndNotify(cart: PizzaConfig[]) {
    try {
        const client = await clientPromise;
        const db = client.db('slicecrafter');
        const inventoryCollection = db.collection('inventory');

        const bulkOperations = [];
        const ingredientNames: string[] = [];

        for (const pizza of cart) {
            const ingredients = [
                pizza.base,
                pizza.sauce,
                pizza.cheese,
                ...pizza.veggies,
                ...pizza.meat
            ].filter((i): i is PizzaOption => i !== null);

            for (const ingredient of ingredients) {
                ingredientNames.push(ingredient.name);
                bulkOperations.push({
                    updateOne: {
                        filter: { name: ingredient.name },
                        update: { $inc: { stock: -1 } }
                    }
                });
            }
        }

        if (bulkOperations.length > 0) {
            await inventoryCollection.bulkWrite(bulkOperations);
        }

        // Check stock levels and notify if low
        const lowStockThreshold = 20;
        const potentiallyLowStockItems = await inventoryCollection.find({
            name: { $in: ingredientNames },
            stock: { $lt: lowStockThreshold }
        }).toArray();

        if(potentiallyLowStockItems.length > 0) {
            const lowStockDetails = potentiallyLowStockItems.map(item => ({
                name: item.name,
                stock: item.stock
            }));

            // This is non-blocking
            notifyAdminOnLowStock({ lowStockDetails: JSON.stringify(lowStockDetails) })
                .then(result => console.log("Low stock notification result:", result.message))
                .catch(e => console.error("Failed to trigger low stock notification flow", e));
        }

    } catch (error) {
        console.error('Failed to update inventory:', error);
    }
}


export async function saveOrder(data: SaveOrderSchema) {
    const validatedData = saveOrderSchema.safeParse(data);

    if (!validatedData.success) {
        console.error("Invalid order data:", validatedData.error);
        throw new Error('Invalid order data provided.');
    }

    const { userId, cart, totalPrice, paymentId } = validatedData.data;

    try {
        const client = await clientPromise;
        const db = client.db('slicecrafter');
        const ordersCollection = db.collection('orders');

        const orderDocument = {
            userId,
            cart,
            totalPrice,
            paymentId,
            status: 'In the Kitchen',
            createdAt: new Date(),
        };

        await ordersCollection.insertOne(orderDocument);

        // After saving the order, update the inventory and trigger notifications
        await updateInventoryAndNotify(cart);

        return { success: true, message: 'Order saved successfully.' };
    } catch (error) {
        console.error('Failed to save order to database:', error);
        return { success: false, message: 'Failed to save order.' };
    }
}

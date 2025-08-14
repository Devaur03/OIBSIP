
'use server';

/**
 * @fileOverview Generates and sends an email to notify admin about low stock levels.
 *
 * - notifyAdminOnLowStock - A function that creates and sends the email.
 * - LowStockInput - The input type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { Resend } from 'resend';
import { getAdminEmail } from '@/app/admin/actions';

const LowStockInputSchema = z.object({
  lowStockDetails: z
    .string()
    .describe('A JSON string detailing the items that are low in stock. E.g. `[{"name": "Onions", "stock": 19}]`'),
});
export type LowStockInput = z.infer<typeof LowStockInputSchema>;

const LowStockOutputSchema = z.object({
  subject: z
    .string()
    .describe('The subject line for the low stock alert email.'),
  content: z
    .string()
    .describe('The body content of the low stock alert email in plain text.'),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function notifyAdminOnLowStock(input: LowStockInput): Promise<{ success: boolean; message: string }> {
  return lowStockNotifierFlow(input);
}

const prompt = ai.definePrompt({
  name: 'lowStockNotifierPrompt',
  input: {schema: LowStockInputSchema},
  output: {schema: LowStockOutputSchema},
  prompt: `You are an inventory management assistant for a pizza shop called ChefPizza.

  Your task is to generate a concise and clear email to the admin about items that are running low on stock.
  The email should be professional, straight to the point, and list the items and their current stock levels.

  Here are the items with low stock:
  {{{lowStockDetails}}}

  Generate a subject line and the email body.
  `,
});

const lowStockNotifierFlow = ai.defineFlow(
  {
    name: 'lowStockNotifierFlow',
    inputSchema: LowStockInputSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string() }),
  },
  async input => {
    try {
        const {output} = await prompt(input);
        
        if (!output) {
            throw new Error("Failed to generate email content from AI.");
        }

        const { subject, content } = output;

        // Fetch the admin email from the database
        const adminEmail = await getAdminEmail();

        // Send the email using Resend
        const { data, error } = await resend.emails.send({
            from: 'ChefPizza Alerts <onboarding@resend.dev>',
            to: [adminEmail],
            subject: subject,
            text: content,
        });

        if (error) {
            console.error("Resend API error:", error);
            throw new Error(`Failed to send email: ${error.message}`);
        }

        console.log("Low stock alert email sent successfully to", adminEmail, "ID:", data?.id);
        return { success: true, message: `Email sent successfully to ${adminEmail}.` };

    } catch (e: any) {
        console.error("An error occurred in the low stock notifier flow:", e);
        return { success: false, message: e.message || "An unknown error occurred." };
    }
  }
);

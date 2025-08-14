'use server';

/**
 * @fileOverview Suggests a pizza topping combination to the user.
 *
 * - suggestPizza - A function that handles the pizza suggestion process.
 * - SuggestPizzaInput - The input type for the suggestPizza function.
 * - SuggestPizzaOutput - The return type for the suggestPizza function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPizzaInputSchema = z.object({
  recentOrderData: z
    .string()
    .describe('The most recent order data in JSON format.'),
});
export type SuggestPizzaInput = z.infer<typeof SuggestPizzaInputSchema>;

const SuggestPizzaOutputSchema = z.object({
  suggestedPizza: z
    .string()
    .describe('A suggestion for a pizza topping combination.'),
});
export type SuggestPizzaOutput = z.infer<typeof SuggestPizzaOutputSchema>;

export async function suggestPizza(input: SuggestPizzaInput): Promise<SuggestPizzaOutput> {
  return suggestPizzaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPizzaPrompt',
  input: {schema: SuggestPizzaInputSchema},
  output: {schema: SuggestPizzaOutputSchema},
  prompt: `You are a pizza expert. Based on the most recent order data, suggest a new pizza combination that the user might like.

  Most Recent Order Data: {{{recentOrderData}}}
  `,
});

const suggestPizzaFlow = ai.defineFlow(
  {
    name: 'suggestPizzaFlow',
    inputSchema: SuggestPizzaInputSchema,
    outputSchema: SuggestPizzaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

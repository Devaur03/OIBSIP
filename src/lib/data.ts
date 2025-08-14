
export interface PizzaOption {
  name: string;
  price: number;
}

export const pizzaBases: PizzaOption[] = [
  { name: 'Thin Crust', price: 8 },
  { name: 'Thick Crust', price: 10 },
  { name: 'Cheese Burst', price: 12 },
  { name: 'Gluten-Free', price: 11 },
  { name: 'Cauliflower Crust', price: 12 },
];

export const pizzaSauces: PizzaOption[] = [
  { name: 'Tomato', price: 1 },
  { name: 'Pesto', price: 2 },
  { name: 'White Garlic', price: 2 },
  { name: 'BBQ', price: 1.5 },
  { name: 'Spicy Red', price: 1.5 },
];

export const cheeseTypes: PizzaOption[] = [
  { name: 'Mozzarella', price: 2 },
  { name: 'Cheddar', price: 2 },
  { name: 'Parmesan', price: 2.5 },
  { name: 'Vegan Cheese', price: 3 },
  { name: 'Provolone', price: 2 },
];

export const veggieToppings: PizzaOption[] = [
  { name: 'Onions', price: 0.5 },
  { name: 'Bell Peppers', price: 0.5 },
  { name: 'Mushrooms', price: 0.75 },
  { name: 'Olives', price: 0.75 },
  { name: 'Jalapeños', price: 0.75 },
  { name: 'Tomatoes', price: 0.5 },
  { name: 'Spinach', price: 0.75 },
  { name: 'Pineapple', price: 1 },
  { name: 'Broccoli', price: 0.75 },
];

export const meatToppings: PizzaOption[] = [
    { name: 'Pepperoni', price: 2 },
    { name: 'Sausage', price: 2 },
    { name: 'Bacon', price: 2.5 },
    { name: 'Chicken', price: 2.5 },
    { name: 'Ham', price: 2 },
];

export interface PreMadePizza {
  name: string;
  description: string;
  image: string;
  hint: string;
  config: {
    base: PizzaOption;
    sauce: PizzaOption;
    cheese: PizzaOption;
    veggies: PizzaOption[];
    meat: PizzaOption[];
  };
}

export const preMadePizzas: PreMadePizza[] = [
  {
    name: 'Classic Pepperoni',
    description: 'A timeless favorite with a rich tomato sauce, mozzarella cheese, and generous slices of pepperoni.',
    image: 'https://placehold.co/600x400.png',
    hint: 'pepperoni pizza',
    config: {
      base: pizzaBases[0], // Thin Crust
      sauce: pizzaSauces[0], // Tomato
      cheese: cheeseTypes[0], // Mozzarella
      veggies: [],
      meat: [meatToppings[0]], // Pepperoni
    },
  },
  {
    name: 'Supreme',
    description: 'The ultimate pizza experience, loaded with pepperoni, sausage, bell peppers, onions, and olives.',
    image: 'https://placehold.co/600x400.png',
    hint: 'supreme pizza',
    config: {
      base: pizzaBases[1], // Thick Crust
      sauce: pizzaSauces[0], // Tomato
      cheese: cheeseTypes[0], // Mozzarella
      veggies: [veggieToppings[0], veggieToppings[1], veggieToppings[3]], // Onions, Bell Peppers, Olives
      meat: [meatToppings[0], meatToppings[1]], // Pepperoni, Sausage
    },
  },
  {
    name: 'Veggie Delight',
    description: 'A garden-fresh pizza with bell peppers, mushrooms, onions, olives, and topped with mozzarella.',
    image: 'https://placehold.co/600x400.png',
    hint: 'veggie pizza',
    config: {
      base: pizzaBases[3], // Gluten-Free
      sauce: pizzaSauces[1], // Pesto
      cheese: cheeseTypes[0], // Mozzarella
      veggies: [veggieToppings[0], veggieToppings[1], veggieToppings[2], veggieToppings[3]], // Onions, Bell Peppers, Mushrooms, Olives
      meat: [],
    },
  },
  {
    name: 'BBQ Chicken',
    description: 'Sweet and tangy BBQ sauce, grilled chicken, red onions, and a blend of mozzarella and cheddar cheese.',
    image: 'https://placehold.co/600x400.png',
    hint: 'bbq chicken',
    config: {
      base: pizzaBases[1], // Thick Crust
      sauce: pizzaSauces[3], // BBQ
      cheese: cheeseTypes[1], // Cheddar
      veggies: [veggieToppings[0]], // Onions
      meat: [meatToppings[3]], // Chicken
    },
  },
];

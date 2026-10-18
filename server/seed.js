// seed.js - inserts 16 sample menu items into MongoDB
// Run with: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/olive_oak_cafe';

const sampleItems = [
  // ---- Breakfast (5) ----
  { name: 'Avocado Toast', description: 'Sourdough toast topped with smashed avocado, chili flakes and a squeeze of lemon.', price: 8.5, category: 'breakfast', popular: true },
  { name: 'Buttermilk Pancakes', description: 'A tall stack of fluffy pancakes served with maple syrup and fresh berries.', price: 9.0, category: 'breakfast', popular: true },
  { name: 'Veggie Omelette', description: 'Three-egg omelette with peppers, onion, spinach and cheddar cheese.', price: 10.5, category: 'breakfast', popular: false },
  { name: 'Granola Bowl', description: 'House-made granola, Greek yogurt, honey and seasonal fruit.', price: 7.5, category: 'breakfast', popular: false },
  { name: 'Bacon & Egg Roll', description: 'Soft brioche roll with crispy bacon, fried egg and smoky mayo.', price: 8.0, category: 'breakfast', popular: false },

  // ---- Lunch (5) ----
  { name: 'Grilled Chicken Panini', description: 'Chicken, roasted peppers, mozzarella and pesto on pressed ciabatta.', price: 11.5, category: 'lunch', popular: true },
  { name: 'Garden Club Sandwich', description: 'Triple-decker sandwich with lettuce, tomato, cucumber and hummus.', price: 10.0, category: 'lunch', popular: false },
  { name: 'Tomato Basil Soup', description: 'Slow-roasted tomato soup with a swirl of cream and fresh basil.', price: 7.0, category: 'lunch', popular: false },
  { name: 'Caesar Salad', description: 'Crisp romaine, parmesan, croutons and creamy Caesar dressing.', price: 9.5, category: 'lunch', popular: true },
  { name: 'Quinoa Buddha Bowl', description: 'Quinoa, roasted vegetables, avocado and lemon-tahini dressing.', price: 12.0, category: 'lunch', popular: false },

  // ---- Drinks (3) ----
  { name: 'Flat White', description: 'Double espresso with silky steamed milk.', price: 4.5, category: 'drinks', popular: true },
  { name: 'Iced Matcha Latte', description: 'Ceremonial-grade matcha shaken with milk and ice.', price: 5.5, category: 'drinks', popular: false },
  { name: 'Fresh Orange Juice', description: 'Cold-pressed oranges, nothing added.', price: 4.0, category: 'drinks', popular: false },

  // ---- Desserts (3) ----
  { name: 'Chocolate Brownie', description: 'Rich fudge brownie served warm with vanilla ice cream.', price: 6.5, category: 'desserts', popular: true },
  { name: 'Lemon Drizzle Cake', description: 'Moist lemon sponge with a tangy sugar glaze.', price: 5.0, category: 'desserts', popular: false },
  { name: 'New York Cheesecake', description: 'Creamy baked cheesecake with a biscuit base and berry compote.', price: 6.0, category: 'desserts', popular: false },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear old menu data so re-seeding is safe
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');

    await MenuItem.insertMany(sampleItems);
    console.log(`Seeded ${sampleItems.length} menu items`);

    await mongoose.connection.close();
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
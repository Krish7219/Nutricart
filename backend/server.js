require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fetch = require('node-fetch');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('./models/User');
const Meal = require('./models/Meal');
const Vendor = require('./models/Vendor');
const Order = require('./models/Order');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret'
});

// Price conversion: USD to INR (multiply by 83)
const USD_TO_INR = 83;

// MongoDB Connection - Update this to your local MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nutricart';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NutriCart API is running' });
});

// RAZORPAY PAYMENT ROUTES

// Create payment order
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    
    if (!amount) {
      return res.status(400).json({ success: false, error: 'Amount is required' });
    }
    
    // Amount is already in paise from frontend, no need to multiply
    const amountInPaise = Math.round(amount);
    
    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: 'order_' + Date.now(),
    };
    
    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify payment signature
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Create signature verification
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret')
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    
    if (generatedSignature === razorpay_signature) {
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Razorpay key for frontend
app.get('/api/payment/key', (req, res) => {
  res.json({
    keyId: process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id'
  });
});

// CHATBOT ROUTE - Gemini API with Fallback
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message, context } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    // Fallback responses for common questions when API key is not configured
    const fallbackResponses = {
      'protein': "Great question about protein! For muscle gain, aim for 1.6-2.2g per kg of body weight. Good sources include chicken, fish, eggs, tofu, legumes, and Greek yogurt. Our Chicken Breast Power Bowl has 48g of protein!"
, 
      'weight loss': "For weight loss, focus on high-protein, fiber-rich meals that keep you full longer. Our Mediterranean Quinoa Bowl (420 cal) and Grilled Salmon (520 cal) are excellent choices. Combine with strength training for best results!"
,
      'weight-loss': "For weight loss, focus on high-protein, fiber-rich meals that keep you full longer. Our Mediterranean Quinoa Bowl (420 cal) and Grilled Salmon (520 cal) are excellent choices. Combine with strength training for best results!"
,
      'vegan': "We have great vegan options! The Mediterranean Quinoa Bowl and Acai Bowl are perfect. The Quinoa Bowl has 14g protein and is rich in fiber - great for energy and recovery!"
,
      'vegetarian': "Our vegetarian options are delicious! The Mediterranean Quinoa Bowl is packed with plant protein from quinoa and chickpeas. The Acai Bowl makes a perfect healthy breakfast!"
,
      'keto': "For keto, look for high-fat, low-carb meals. Our Grilled Salmon with Asparagus has only 8g carbs and 34g fat - perfect for keto dieters!"
,
      'gluten free': "Many of our meals are gluten-free! The Grilled Salmon, Chicken Power Bowl, and Acai Bowl are all naturally gluten-free. Check each meal's dietary tags for confirmation."
,
      'gluten-free': "Many of our meals are gluten-free! The Grilled Salmon, Chicken Power Bowl, and Acai Bowl are all naturally gluten-free. Check each meal's dietary tags for confirmation."
,
      'calories': "Calorie awareness is key for fitness! Our meals range from 380-580 calories. For weight loss, aim for 300-500 calorie deficits. Our Acai Bowl at 380cal is great for lighter meals!"
,
      'muscle': "For muscle building, prioritize protein intake! Our Chicken Breast Power Bowl has 48g protein - perfect post-workout. Pair with our Grilled Salmon (42g protein) for variety!"
,
      'meal plan': "Here's a sample day: Breakfast - Acai Bowl, Lunch - Mediterranean Quinoa Bowl, Dinner - Grilled Salmon with Asparagus. This gives you balanced nutrition with ~40g protein at each meal!"
,
      'healthy': "Healthy eating is about balance! Our meals are nutritionally balanced with proteins, complex carbs, and healthy fats. Check our nutrition info for each meal to make informed choices!"
,
      'recommend': "Based on general fitness, I'd recommend: 1) Chicken Breast Power Bowl (highest protein), 2) Grilled Salmon (omega-3s), 3) Mediterranean Quinoa Bowl (fiber-rich). What are your goals?"
,
      'help': "I can help with: nutrition advice, meal recommendations, calorie/macro questions, dietary restrictions (vegan, keto, gluten-free), fitness goals, and healthy eating tips. What would you like to know?"
,
      'hi': "Hi! I'm your NutriCart fitness assistant. Ask me about nutrition, fitness tips, meal recommendations, or healthy eating. How can I help you today?"
,
      'hello': "Hello! I'm here to help with fitness and nutrition. Ask me about meal planning, protein intake, weight loss, or any health-related questions!"
,
      'default': "That's a great question! For personalized advice, I'd recommend our Chicken Breast Power Bowl (48g protein) for muscle goals, or the Mediterranean Quinoa Bowl for a lighter, fiber-rich option. What are your fitness goals?"
    };
    
    // Use fallback if no API key
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'AIzaSyBexeygaGltQm9q84QWqfLXhSEDNN_beG8') {
      const lowerMessage = message.toLowerCase();
      let response = fallbackResponses['default'];
      
      // Find matching fallback response
      for (const [key, value] of Object.entries(fallbackResponses)) {
        if (lowerMessage.includes(key)) {
          response = value;
          break;
        }
      }
      
      return res.json({ 
        success: true, 
        response: response,
        fallback: true
      });
    }

    const fitnessContext = `You are a fitness and nutrition expert assistant for NutriCart, a healthy meal delivery service. 
You help users with:
- Fitness and nutrition advice
- Meal recommendations based on their goals
- Dietary information and healthy eating tips
- Weight management guidance
- Exercise and workout nutrition advice

User context: ${context || 'General fitness inquiry'}

Provide helpful, accurate, and encouraging responses about fitness and nutrition. Keep responses concise but informative.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${AIzaSyAiHT5JDxWWnkoRoKS5KlIHkrkE8X2nyBs}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${fitnessContext}\n\nUser question: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ success: false, error: data.error.message });
    }

    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    
    res.json({ success: true, response: botResponse });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// AUTH ROUTES

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, goals = [], dietary = [] } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }
    
    const newUser = new User({
      email,
      password,
      name,
      goals,
      dietaryPreferences: dietary,
      loyaltyPoints: 100,
      tier: 'bronze'
    });
    
    await newUser.save();
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get current user
app.get('/api/auth/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
app.put('/api/auth/user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DAILY INTAKE ROUTES

// Get today's intake
app.get('/api/auth/user/:id/today-intake', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get today's date string
    const today = new Date().toISOString().split('T')[0];
    
    const todayIntake = user.dailyIntake.find(intake => {
      return intake.date === today;
    });
    
    const meals = todayIntake ? todayIntake.meals : [];
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
    const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
    const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);
    
    // Check if calorie limit exceeded
    const warning = totalCalories > user.dailyCalorieLimit ? 
      `⚠️ You've exceeded your daily calorie limit of ${user.dailyCalorieLimit} calories! Consider having a lighter meal.` : null;
    
    res.json({
      meals,
      totals: { calories: totalCalories, protein: totalProtein, carbs: totalCarbs, fat: totalFat },
      calorieLimit: user.dailyCalorieLimit,
      warning
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add meal to today's intake
app.post('/api/auth/user/:id/daily-intake', async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat, type, mealId } = req.body;
    const userId = req.params.id;
    
    // Get today's date as string
    const todayStr = new Date().toISOString().split('T')[0];
    
    // First check if there's already an entry for today
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const todayIntake = existingUser.dailyIntake.find(intake => intake.date === todayStr);
    
    const newMeal = {
      name,
      calories: Number(calories),
      protein: Number(protein || 0),
      carbs: Number(carbs || 0),
      fat: Number(fat || 0),
      type: type || 'meal',
      source: mealId ? 'ordered' : 'home-cooked',
      mealId: mealId || null
    };
    
    let updatedUser;
    
    if (todayIntake) {
      // Push to existing day's meals
      updatedUser = await User.findOneAndUpdate(
        { _id: userId, 'dailyIntake.date': todayStr },
        { $push: { 'dailyIntake.$.meals': newMeal } },
        { new: true }
      );
    } else {
      // Create new day entry
      updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { dailyIntake: { date: todayStr, meals: [newMeal] } } },
        { new: true }
      );
    }
    
    if (!updatedUser) {
      return res.status(500).json({ error: 'Failed to update user' });
    }
    
    // Get the updated today's intake
    const updatedTodayIntake = updatedUser.dailyIntake.find(intake => intake.date === todayStr);
    const totalCalories = updatedTodayIntake ? updatedTodayIntake.meals.reduce((sum, meal) => sum + meal.calories, 0) : 0;
    
    const warning = totalCalories > updatedUser.dailyCalorieLimit ? 
      `⚠️ You've exceeded your daily calorie limit of ${updatedUser.dailyCalorieLimit} calories! Consider having a lighter meal.` : null;
    
    res.json({ 
      success: true, 
      meal: newMeal,
      totalCalories,
      warning 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update daily calorie limit
app.put('/api/auth/user/:id/calorie-limit', async (req, res) => {
  try {
    const { dailyCalorieLimit } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { dailyCalorieLimit: Number(dailyCalorieLimit) },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MEALS ROUTES

// Get all meals
app.get('/api/meals', async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get meal by ID
app.get('/api/meals/:id', async (req, res) => {
  try {
    const meal = await Meal.findOne({ id: req.params.id });
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    res.json(meal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trending meals
app.get('/api/meals/trending', async (req, res) => {
  try {
    const trendingMeals = await Meal.find({ trending: true }).limit(8);
    res.json(trendingMeals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filter meals by goal
app.get('/api/meals/filter', async (req, res) => {
  try {
    const { goal, vendor, minPrice, maxPrice } = req.query;
    let filter = {};
    
    if (goal) {
      filter.goals = goal;
    }
    if (vendor) {
      filter.vendorId = vendor;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    const meals = await Meal.find(filter);
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// VENDORS ROUTES

// Get all vendors
app.get('/api/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendor by ID
app.get('/api/vendors/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ORDERS ROUTES

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, totalAmount, deliveryAddress } = req.body;
    
    const order = new Order({
      userId,
      items,
      totalAmount,
      deliveryAddress,
      status: 'confirmed',
      paymentStatus: 'completed'
    });
    
    await order.save();
    
    // Update user order history
    await User.findByIdAndUpdate(userId, {
      $push: { orderHistory: order._id },
      $inc: { 'weeklyReport.mealsOrdered': items.length }
    });
    
    // Update meal order counts
    for (const item of items) {
      await Meal.findByIdAndUpdate(item.mealId, {
        $inc: { orderCount: item.quantity }
      });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user orders
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate('items.mealId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendor orders (for vendor dashboard)
app.get('/api/orders/vendor/:vendorId', async (req, res) => {
  try {
    const meals = await Meal.find({ vendorId: req.params.vendorId }).select('_id');
    const mealIds = meals.map(m => m._id);
    
    const orders = await Order.find({
      'items.mealId': { $in: mealIds }
    }).populate('items.mealId').sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Seed data endpoint
app.post('/api/seed', async (req, res) => {
  try {
    await User.deleteMany({});
    await Meal.deleteMany({});
    await Vendor.deleteMany({});
    await Order.deleteMany({});
    
    const vendors = await Vendor.insertMany([
      {name: 'Green Kitchen', rating: 4.8, deliveryTime: '20-30 min', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200', popularItems: ['v1-m1', 'v1-m2', 'v1-m4'], totalOrders: 1250, phone: '+1 (555) 123-4567', email: 'contact@greenkitchen.com', address: '123 Health Street, Food City'},
      {name: 'Protein House', rating: 4.6, deliveryTime: '25-35 min', image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=200', popularItems: ['v2-m1', 'v2-m2', 'v2-m3'], totalOrders: 980, phone: '+1 (555) 234-5678', email: 'info@proteinhouse.com', address: '456 Muscle Ave, Fitness Town'},
      {name: 'Fresh Bowl Co', rating: 4.9, deliveryTime: '15-25 min', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200', popularItems: ['v3-m1', 'v3-m2', 'v3-m4'], totalOrders: 1560, phone: '+1 (555) 345-6789', email: 'support@freshbowlco.com', address: '789 Bowl Lane, Fresh City'},
      {name: 'Zen Meals', rating: 4.7, deliveryTime: '30-40 min', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=200', popularItems: ['v4-m1', 'v4-m3', 'v4-m4'], totalOrders: 720, phone: '+1 (555) 456-7890', email: 'hello@zenmeals.com', address: '321 Zen Way, Wellness City'}
    ]);

    const meals = await Meal.insertMany([
      {id: 'v1-m1', vendorId: vendors[0]._id, name: 'Mediterranean Quinoa Bowl', description: 'A refreshing bowl with quinoa, roasted vegetables, hummus, and lemon tahini dressing', price: 21560, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', calories: 420, protein: 14, carbs: 52, fat: 18, fiber: 9, sodium: 380, sugar: 6, goals: ['maintenance', 'vegan', 'gluten-free'], dietary: ['vegetarian', 'vegan', 'gluten-free'], rating: 4.8, orderCount: 342, trending: true, nutrition: {vitamins: ['A', 'C', 'B6', 'folate'], minerals: ['Iron', 'Magnesium', 'Zinc'], ingredients: ['Quinoa', 'Chickpeas', 'Cucumber', 'Tomatoes', 'Olives', 'Tahini'], allergens: ['Sesame']}},
      {id: 'v1-m2', vendorId: vendors[0]._id, name: 'Grilled Salmon with Asparagus', description: 'Wild-caught salmon with lemon herb butter, served with roasted asparagus', price: 31520, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400', calories: 520, protein: 42, carbs: 8, fat: 34, fiber: 4, sodium: 520, sugar: 2, goals: ['muscle-gain', 'keto', 'maintenance'], dietary: ['gluten-free', 'dairy-free'], rating: 4.9, orderCount: 287, trending: true, nutrition: {vitamins: ['D', 'B12', 'E'], minerals: ['Iron', 'Selenium', 'Phosphorus'], ingredients: ['Salmon', 'Asparagus', 'Lemon', 'Butter', 'Herbs'], allergens: ['Fish', 'Dairy']}},
      {id: 'v2-m1', vendorId: vendors[1]._id, name: 'Chicken Breast Power Bowl', description: 'Grilled organic chicken breast with brown rice and broccoli', price: 24880, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', calories: 580, protein: 48, carbs: 45, fat: 22, fiber: 8, sodium: 420, sugar: 4, goals: ['muscle-gain', 'maintenance'], dietary: ['gluten-free'], rating: 4.7, orderCount: 412, trending: true, nutrition: {vitamins: ['B3', 'B6', 'C'], minerals: ['Selenium', 'Phosphorus', 'Magnesium'], ingredients: ['Chicken Breast', 'Brown Rice', 'Broccoli', 'Olive Oil'], allergens: []}},
      {id: 'v3-m1', vendorId: vendors[2]._id, name: 'Acai Bowl', description: 'Fresh acai berry bowl with granola, banana, and honey', price: 19900, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', calories: 380, protein: 8, carbs: 68, fat: 12, fiber: 10, sodium: 45, sugar: 32, goals: ['maintenance', 'vegan'], dietary: ['vegetarian', 'vegan'], rating: 4.9, orderCount: 567, trending: true, nutrition: {vitamins: ['C', 'B6', 'E'], minerals: ['Potassium', 'Magnesium', 'Iron'], ingredients: ['Acai', 'Granola', 'Banana', 'Strawberries', 'Honey'], allergens: ['Tree Nuts', 'Gluten']}}
    ]);

    await User.create({email: 'john@example.com', password: 'password123', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', loyaltyPoints: 2150, tier: 'platinum', joinDate: '2024-01-15', goals: ['muscle-gain', 'maintenance'], dietaryPreferences: ['gluten-free', 'low-carb'], weeklyReport: {caloriesConsumed: 12800, caloriesGoal: 14000, proteinConsumed: 520, proteinGoal: 500, mealsOrdered: 12, favoriteCategory: 'High Protein', streakDays: 14}, subscriptions: [{plan: 'Monthly Power', startDate: new Date('2024-02-01'), endDate: new Date('2024-03-01'), active: true}]});

    await User.create({email: 'demo@nutricart.com', password: 'demo123', name: 'Demo User', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', loyaltyPoints: 3500, tier: 'platinum', joinDate: '2023-06-01', goals: ['muscle-gain', 'weight-loss', 'maintenance'], dietaryPreferences: ['gluten-free', 'low-carb', 'dairy-free'], weeklyReport: {caloriesConsumed: 13500, caloriesGoal: 14000, proteinConsumed: 580, proteinGoal: 500, mealsOrdered: 16, favoriteCategory: 'High Protein', streakDays: 28}, subscriptions: [{plan: 'Monthly Power', startDate: new Date('2023-07-01'), endDate: new Date('2024-04-01'), active: true}]});

    res.json({ success: true, message: 'Database seeded successfully!', vendors: vendors.length, meals: meals.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NutriCart API running on http://localhost:${PORT}`);
  console.log(`📋 To seed database, make a POST request to http://localhost:${PORT}/api/seed`);
});

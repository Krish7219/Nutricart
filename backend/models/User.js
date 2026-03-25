const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
  loyaltyPoints: { type: Number, default: 100 },
  tier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' },
  joinDate: { type: Date, default: Date.now },
  goals: [{ type: String }],
  dietaryPreferences: [{ type: String }],
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  dailyIntake: [{
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    meals: [{
      name: { type: String, required: true },
      calories: { type: Number, required: true },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], default: 'meal' },
      source: { type: String, enum: ['ordered', 'home-cooked'], default: 'home-cooked' },
      mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }
    }]
  }],
  dailyCalorieLimit: { type: Number, default: 700 },
  weeklyReport: {
    caloriesConsumed: { type: Number, default: 0 },
    caloriesGoal: { type: Number, default: 14000 },
    proteinConsumed: { type: Number, default: 0 },
    proteinGoal: { type: Number, default: 400 },
    mealsOrdered: { type: Number, default: 0 },
    favoriteCategory: { type: String, default: 'None' },
    streakDays: { type: Number, default: 0 }
  },
  subscriptions: [{
    plan: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    active: { type: Boolean, default: false }
  }]
});

module.exports = mongoose.model('User', userSchema);

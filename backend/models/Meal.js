const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  fiber: { type: Number, default: 0 },
  sodium: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  goals: [{ type: String }],
  dietary: [{ type: String }],
  rating: { type: Number, default: 4.0 },
  orderCount: { type: Number, default: 0 },
  trending: { type: Boolean, default: false },
  nutrition: {
    vitamins: [{ type: String }],
    minerals: [{ type: String }],
    ingredients: [{ type: String }],
    allergens: [{ type: String }]
  }
});

module.exports = mongoose.model('Meal', mealSchema);

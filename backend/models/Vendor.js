const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, default: 4.0 },
  deliveryTime: { type: String, required: true },
  image: { type: String, required: true },
  popularItems: [{ type: String }],
  totalOrders: { type: Number, default: 0 }
});

module.exports = mongoose.model('Vendor', vendorSchema);

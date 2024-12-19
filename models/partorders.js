const mongoose = require("mongoose");

// Define the Service schema
const PartsSchema = new mongoose.Schema({
  item: { type: String, required: true },
  amount: { type: Number, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true }, // Calculated total for each service (amount * quantity)
});

// Define the Vehicle schema
const PartsOrderSchema = new mongoose.Schema({
  parts: [PartsSchema],
  supplier: { type: String, required: true },
  phone: { type: String, required: true },
  targetVehicle: { type: String },
  date: { type: Date, default: Date.now },
  totalAmount: { type: Number, default: 0 },
});

// Pre-save hook to calculate `totalAmount`, `pendingAmount`, and update `statusOfWork`
PartsOrderSchema.pre("save", async function (next) {
  const partOrder = this;

  // Ensure `totalPrice` is calculated for each service
  partOrder.parts.forEach((part) => {
    if (!part.totalPrice) {
      part.totalPrice = part.amount * part.quantity;
    }
  });

  partOrder.totalAmount = partOrder.parts.reduce(
    (total, part) => total + part.totalPrice,
    0
  );

  next();
});

// Create and export
module.exports = mongoose.model("Parts", PartsOrderSchema);

const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  expense: { type: String, required: true },
  amount: { type: Number, required: true },
});

module.exports = mongoose.model("Expenses", ExpenseSchema);

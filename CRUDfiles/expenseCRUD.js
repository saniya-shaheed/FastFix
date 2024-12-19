const Expense = require("../models/expenses");

exports.createExpense = async (req, res) => {
  try {
    const { expense, amount } = req.body;
    const date = new Date().toLocaleDateString();

    const newExpense = new Expense({
      date,
      expense,
      amount,
    });

    await newExpense.save();
    res
      .status(201)
      .json({ message: "Expense created successfully", data: newExpense });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating expense record", error: error.message });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching expense records",
        error: error.message,
      });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Expense record", error: error.message });
  }
};

// Update vehicle record
exports.updateExpense = async (req, res) => {
  try {
    // Use Mongoose's `findByIdAndUpdate` method to update the document
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id, // ID of the document to update
      req.body, // New data for the document
      { new: true } // Option to return the updated document
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    console.log("Successfully updated", updatedExpense);
    res
      .status(200)
      .json({ message: "Successfully updated!", data: updatedExpense });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating expense record", error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense)
      return res.status(404).json({ message: "Expense not found" });
    res.status(200).json({ message: "Expense record deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Expense record", error: error.message });
  }
};

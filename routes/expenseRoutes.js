const express = require("express");
const router = express.Router();
const expenseController = require("../CRUDfiles/expenseCRUD");

router.post("/expenses", expenseController.createExpense);
router.get("/expenses", expenseController.getAllExpenses);
router.get("/expenses/:id", expenseController.getExpenseById);
router.put("/expenses/:id", expenseController.updateExpense);
router.delete("/expenses/:id", expenseController.deleteExpense);

module.exports = router;

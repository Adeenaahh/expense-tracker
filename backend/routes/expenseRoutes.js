
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const file = path.join(__dirname, "..", "expenses.json");

function readExpenses() {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]");
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveExpenses(expenses) {
  fs.writeFileSync(file, JSON.stringify(expenses, null, 2));
}

router.get("/", (req, res) => {
  res.json(readExpenses());
});

router.post("/", (req, res) => {
  const expense = {
    _id: Date.now().toString(),
    ...req.body,
    amount: Number(req.body.amount)
  };

  const expenses = readExpenses();
  expenses.push(expense);
  saveExpenses(expenses);
  res.status(201).json(expense);
});

router.put("/:id", (req, res) => {
  const expenses = readExpenses();
  const index = expenses.findIndex(e => e._id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Expense not found" });
  }

  expenses[index] = {
    ...expenses[index],
    ...req.body,
    amount: Number(req.body.amount)
  };

  saveExpenses(expenses);
  res.json(expenses[index]);
});

router.delete("/:id", (req, res) => {
  const expenses = readExpenses();
  const updated = expenses.filter(e => e._id !== req.params.id);

  if (updated.length === expenses.length) {
    return res.status(404).json({ message: "Expense not found" });
  }

  saveExpenses(updated);
  res.json({ message: "Expense deleted" });
});

module.exports = router;

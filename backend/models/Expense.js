const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than zero"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Food", "Travel", "Bills", "Shopping", "Other"]
    },
    date: {
      type: Date,
      required: [true, "Date is required"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);

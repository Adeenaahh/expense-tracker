import { useEffect, useMemo, useState } from "react";
import api from "./api";

const blankForm = {
  title: "",
  amount: "",
  category: "Food",
  date: new Date().toISOString().slice(0, 10)
};

const categories = ["Food", "Travel", "Bills", "Shopping", "Other"];

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value);
}

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadExpenses() {
    try {
      setError("");
      const response = await api.get("/");
      setExpenses(response.data);
    } catch {
      setError("Could not load expenses. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + Number(expense.amount), 0),
    [expenses]
  );

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function resetForm() {
    setForm(blankForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!form.title.trim() || !form.amount || Number(form.amount) <= 0 || !form.date) {
      setError("Please enter a title, positive amount, category, and date.");
      return;
    }

    try {
      const payload = { ...form, title: form.title.trim(), amount: Number(form.amount) };
      if (editingId) {
        await api.put(`/${editingId}`, payload);
        setMessage("Expense updated successfully.");
      } else {
        await api.post("/", payload);
        setMessage("Expense added successfully.");
      }
      resetForm();
      await loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save the expense.");
    }
  }

  function startEdit(expense) {
    setEditingId(expense._id);
    setForm({
      title: expense.title,
      amount: String(expense.amount),
      category: expense.category,
      date: new Date(expense.date).toISOString().slice(0, 10)
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteExpense(id) {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    setMessage("");
    setError("");
    try {
      await api.delete(`/${id}`);
      setMessage("Expense deleted successfully.");
      if (editingId === id) resetForm();
      await loadExpenses();
    } catch {
      setError("Unable to delete this expense.");
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <div className="brand-mark">₹</div>
        <div>
          <p className="eyebrow">YOUR MONEY, MADE CLEAR</p>
          <h1>Personal Expense Tracker</h1>
        </div>
      </header>

      <section className="summary-card">
        <div>
          <p className="summary-label">Total amount spent</p>
          <h2>{money(total)}</h2>
          <p className="summary-note">Across {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}</p>
        </div>
        <div className="summary-icon" aria-hidden="true">↗</div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPENSE MANAGER</p>
            <h2>{editingId ? "Edit expense" : "Add a new expense"}</h2>
          </div>
          {editingId && <button className="button button-light" type="button" onClick={resetForm}>Cancel edit</button>}
        </div>

        {message && <p className="notice success" role="status">{message}</p>}
        {error && <p className="notice error" role="alert">{error}</p>}

        <form onSubmit={handleSubmit} className="expense-form">
          <label>
            Expense title
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Lunch with friends" maxLength="100" required />
          </label>
          <label>
            Amount (₹)
            <input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} placeholder="e.g. 250" required />
          </label>
          <label>
            Category
            <select name="category" value={form.category} onChange={handleChange}>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label>
            Date
            <input name="date" type="date" value={form.date} onChange={handleChange} required />
          </label>
          <button className="button button-primary submit-button" type="submit">
            {editingId ? "Save changes" : "Add expense"}
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading list-heading">
          <div>
            <p className="eyebrow">YOUR RECORDS</p>
            <h2>Recent expenses</h2>
          </div>
          <span className="count-pill">{expenses.length} total</span>
        </div>

        {loading ? (
          <p className="empty-state">Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">＋</div>
            <h3>No expenses yet</h3>
            <p>Add your first expense using the form above.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Expense</th><th>Category</th><th>Date</th><th>Amount</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td data-label="Expense"><span className="expense-title">{expense.title}</span></td>
                    <td data-label="Category"><span className="category-pill">{expense.category}</span></td>
                    <td data-label="Date">{new Date(expense.date).toLocaleDateString("en-IN")}</td>
                    <td data-label="Amount" className="amount-cell">{money(Number(expense.amount))}</td>
                    <td data-label="Actions">
                      <div className="actions">
                        <button className="button button-edit" onClick={() => startEdit(expense)} type="button">Edit</button>
                        <button className="button button-delete" onClick={() => deleteExpense(expense._id)} type="button">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <footer>Personal Expense Tracker · Built with React, Express and MongoDB</footer>
    </main>
  );
}

export default App;
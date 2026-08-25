import { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:5000';
const CURRENCIES = ['USD', 'EUR', 'GBP', 'NPR', 'INR'];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');

  const [homeCurrency, setHomeCurrency] = useState('NPR');
  const [converted, setConverted] = useState({}); // { expenseId: convertedAmount }
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialError, setInitialError] = useState(null);
  const [convertLoading, setConvertLoading] = useState(false);
  const [convertError, setConvertError] = useState(null);
  const [formError, setFormError] = useState(null);

  //1. on page load it fetches all expenses from the backend and stores them in state
  useEffect(() => {
    async function loadExpenses() {
      setInitialLoading(true);
      setInitialError(null);

      try {
        const res = await fetch(`${API_BASE}/expenses`);

        if (!res.ok) {
          throw new Error('Failed to load expenses');
        }

        const data = await res.json();
        setExpenses(data);
      } catch (error) {
        setInitialError('Could not load expenses. Is the backend running?');
      } finally {
        setInitialLoading(false);
      }
    }

    loadExpenses();
  }, []);

  //2.Whenever `expenses` or `homeCurrency` changes, re-run conversions.
  useEffect(() => {
    if (initialLoading) {
      return;
    }

    async function convertAll() {
    setConvertLoading(true);
    setConvertError(null);
    try {
      const results = {};
      for (const expense of expenses) {
        const res = await fetch(`${API_BASE}/convert?from=${expense.currency}&to=${homeCurrency}&amount=${expense.amount}`);

        if (!res.ok) {
          throw new Error('Conversion failed');
        }

        const data = await res.json();

        if (typeof data.result !== 'number') {
          throw new Error('Invalid conversion result');
        }

        results[expense.id] = data.result;
      }

      setConverted(results);
    } catch (err) {
      setConverted({});
      setConvertError('Could not convert some expenses. Please try again.');
    } finally {
      setConvertLoading(false);
    }
    }

    convertAll();
  }, [expenses, homeCurrency, initialLoading]);
 
  // 3. handle form submission
  function handleSubmit(e) {
  e.preventDefault();
  setFormError(null);

  fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, amount: Number(amount), currency }),
  })
    .then(res => res.json().then(data => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
      if (!ok) {
        const message = data.details ? data.details.join(', ') : (data.error || 'Failed to add expense');
        setFormError(message);
        return;
      }
      setExpenses([...expenses, data]);
      setTitle('');
      setAmount('');
    })
    .catch(() => {
      setFormError('Could not reach the server. Is it running?');
    });
}

  // 4. Handle deleting an expense by id.
  function handleDelete(id) {
    fetch(`${API_BASE}/expenses/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Delete failed');
        }

        setExpenses(expenses.filter((expense) => expense.id !== id));
      })
      .catch(() => {
        setConvertError('Could not delete the expense. Please try again.');
      });
  }

  const total = expenses.reduce((sum, e) => sum + (converted[e.id] ?? 0), 0);
   return (
    <div className="app">
      <h1>Expense Tracker</h1>

      {initialLoading && <p>Loading expenses...</p>}
      {initialError && <p className="error">{initialError}</p>}

      <form onSubmit={handleSubmit}>
        
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button type="submit">Add Expense</button>
      </form>
      
      {formError && <p className="error">{formError}</p>}

      <div className="home-currency">
        <label>Home currency: </label>
        <select value={homeCurrency} onChange={(e) => setHomeCurrency(e.target.value)}>
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {convertLoading && <p>Converting...</p>}
      {convertError && <p className="error">{convertError}</p>}

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.title} — {expense.amount} {expense.currency}
            {' -> '}
            {converted[expense.id] !== undefined
              ? `${converted[expense.id].toFixed(2)} ${homeCurrency}`
              : '...'}
            <button onClick={() => handleDelete(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Total: {total.toFixed(2)} {homeCurrency}</h2>
    </div>
  );



}

export default App;
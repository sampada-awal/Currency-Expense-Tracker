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
  const [convertLoading, setConvertLoading] = useState(false);
  const [convertError, setConvertError] = useState(null);

  //1. on page load it fetches all expenses from the backend and stores them in state
  useEffect(() => {
   fetch(`${API_BASE}/expenses`)
  .then(res => res.json())
  .then(data => setExpenses(data));
  }, []);

  //2.Whenever `expenses` or `homeCurrency` changes, re-run conversions.
   useEffect(() => {
    async function convertAll() {
    setConvertLoading(true);
    setConvertError(null);
    try {
      const results = {};
      for (const expense of expenses) {
      const res = await fetch(`${API_BASE}/convert?from=${expense.currency}&to=${homeCurrency}&amount=${expense.amount}`);
      const data = await res.json();
      results[expense.id] = data.result;
    }
    setConverted(results);
   } catch (err) {
    setConvertError('Could not convert some expenses.');
  } finally {
    setConvertLoading(false);
  }
  }
  convertAll();
  }, [expenses, homeCurrency]);
 
  // 3. handle form submission
  function handleSubmit(e) {
    fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, amount: Number(amount), currency }),
    })
    .then(res => res.json())
    .then(newExpense => {
    setExpenses([...expenses, newExpense]);
    setTitle('');
    setAmount('');
   });
  }

  // 4. Handle deleting an expense by id. 
  function handleDelete(id) { 
    fetch(`${API_BASE}/expenses/${id}`, { method: 'DELETE' })
   .then(() => setExpenses(expenses.filter(e => e.id !== id)));
 }




}

export default App;
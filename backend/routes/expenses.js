const express = require('express');
const router = express.Router();
const { expenses } = require('../store');
const crypto = require('crypto');
const { ALLOWED_CURRENCIES } = require('../currencies');

//routes go here using router.get, router.post, etc.
router.get('/', (req, res) => {
  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(sorted);
});

router.post('/', (req, res) => {
  const { title, amount, currency, date } = req.body;

  const errors = [];

  if (typeof title !== 'string' || title.trim() === ''){
    errors.push('Title is required and must be a non-empty string');
  }

  if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
  errors.push('Amount is required and must be a positive number');
}

  if (typeof currency !== 'string' || !ALLOWED_CURRENCIES.includes(currency.toUpperCase())) {
    errors.push('Currency is required and must be one of the allowed currencies');
  }

  if (date && (typeof date !== 'string' || Number.isNaN(new Date(date).getTime()))) {
    errors.push('Date is required and must be a valid date string');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  const newExpense = {
    id: crypto.randomUUID(),
    title: title.trim(),
    amount,
    currency,       // apply whatever normalization you decided on
    date: date ? new Date(date).toISOString() : new Date().toISOString(),
  };

  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // find the index of the expense with this id in the array
  // if not found (index === -1), respond 404 with a message

  // otherwise, remove it from the array (look up Array.prototype.splice)
  // and send back the removed item
});
module.exports = router;
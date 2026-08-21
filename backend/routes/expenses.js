const express = require('express');
const router = express.Router();

//routes go here using router.get, router.post, etc.
router.get('/', (req, res) => {
  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(sorted);
});

router.post('/', (req, res) => {
  const { title, amount, currency, date } = req.body;

  const errors = [];

  // check title: is it a non-empty string after trimming?
  // if invalid, errors.push('some message')

  // check amount: is it a number, and > 0?

  // check currency: is it in ALLOWED_CURRENCIES? (decide case-sensitivity here)

  // check date: if provided, does `new Date(date)` produce a valid date?
  //   hint: an invalid date's .getTime() returns NaN — Number.isNaN(someDate.getTime())
  //         is how you detect that

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
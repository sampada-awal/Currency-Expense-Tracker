const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;
const expensesRouter = require('./routes/expenses');
const convertRouter = require('./routes/convert');

app.use(cors());
app.use(express.json());

app.use('/expenses', expensesRouter);
app.use('/convert', convertRouter);

app.get('/', (req, res)=>{
    res.send('Welcome to the Currency Expense Tracker API');
});

app.get('/health', (req, res) =>{
    res.json({Status: "ok"});
});

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});
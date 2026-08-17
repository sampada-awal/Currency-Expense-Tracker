const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
// basic route for the homepage
app.get('/', (req, res)=>{
    res.send('Welcome to the Currency Expense Tracker API');
});

//start listening for network req
app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/health', (req, res) =>{
    res.json({Status: "ok"});
});

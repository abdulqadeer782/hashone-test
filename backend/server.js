const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db.js');
const todoRoutes = require('./routes/todosRoutes.js');

const app = express();

// dotenv config
dotenv.config();

// db config
connectDB();

// middleware
app.use(express.json());
app.use(cors());

// routes 
app.use('/api', todoRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port http://localhost:${port} 🔥`));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/AllProducts');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

app.use('/products', productRoutes);

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('MongoDB Connected');
}).catch((err) => {
  console.error('MongoDB Connection Failed:', err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
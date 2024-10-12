const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/comp3123_assigment1')
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/signup', [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    try {
    } catch (err) {
        console.error(err.message);
        console.error(err.stack);
        res.status(500).send('Server error');
    }

    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({email});
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ username, email, password: await bcrypt.hash(password, 10) });
        await user.save();

        res.status(201).json({ message: 'User created successfully', user_id: user._id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({ message: 'Invalid username or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

        const token = jwt.sign({ id: user._id }, 'jwtSecret', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

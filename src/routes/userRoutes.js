const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Assignment = require('../models/Assignment');

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        const user = new User({
            name,
            email,
            password,
            role: 'user'
        });

        await user.save();

        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, role: 'user' });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Upload assignment
router.post('/upload', async (req, res) => {
    try {
        const { userId, adminId, name } = req.body;

        if (!userId || !adminId || !name) {
            return res.status(400).json({
                error: 'userId, adminId and name are required'
            });
        }

        // Verify user exists
        const user = await User.findOne({ id: userId, role: 'user' });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify admin exists
        const admin = await User.findOne({ id: adminId, role: 'admin' });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const assignment = new Assignment({
            userId,
            adminId,
            name
        });

        await assignment.save();

        res.status(201).json({
            message: 'Upload successful',
            assignment: {
                assignmentId: assignment.assignmentId,
                userId: assignment.userId,
                adminId: assignment.adminId,
                name: assignment.name,
                status: assignment.status
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// View all admins
router.get('/admins', async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' })
            .select('id name email role -_id');

        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Assignment = require('../models/Assignment');

// Admin Registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        const admin = new User({
            name,
            email,
            password,
            role: 'admin'
        });

        await admin.save();

        res.status(201).json({
            message: 'Registration successful',
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await User.findOne({ email, role: 'admin' });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            message: 'Login successful',
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// View assignments
router.get('/assignments/:adminId', async (req, res) => {
    try {
        const assignments = await Assignment.find({
            adminId: parseInt(req.params.adminId)
        });

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Accept assignment
router.post('/assignments/accept', async (req, res) => {
    try {
        const { adminId, assignmentId } = req.body;

        const assignment = await Assignment.findOneAndUpdate(
            { 
                assignmentId: assignmentId,
                adminId: adminId
            },
            { status: 'accepted' },
            { new: true }
        );

        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        res.json({
            assignmentId: assignment.assignmentId,
            name: assignment.name,
            status: assignment.status
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Reject assignment
router.post('/assignments/reject', async (req, res) => {
    try {
        const { adminId, assignmentId } = req.body;

        const assignment = await Assignment.findOneAndUpdate(
            { 
                assignmentId: assignmentId,
                adminId: adminId
            },
            { status: 'rejected' },
            { new: true }
        );

        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        res.json({
            assignmentId: assignment.assignmentId,
            name: assignment.name,
            status: assignment.status
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
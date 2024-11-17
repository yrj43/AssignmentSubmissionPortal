const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Counter = require('./Counter');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    }
}, { timestamps: true });

// Remove any existing indexes
userSchema.index({ username: 1 }, { unique: false, sparse: true });

// Auto-increment id
userSchema.pre('save', async function(next) {
    try {
        if (this.isNew) {
            const counter = await Counter.findByIdAndUpdate(
                'userId',
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.id = counter.seq;
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Hash password
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
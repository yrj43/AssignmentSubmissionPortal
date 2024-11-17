const mongoose = require('mongoose');
const Counter = require('./Counter');

const assignmentSchema = new mongoose.Schema({
    assignmentId: {
        type: Number,
        unique: true
    },
    userId: {
        type: Number,
        required: true
    },
    adminId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

assignmentSchema.pre('save', async function(next) {
    try {
        if (this.isNew) {
            const counter = await Counter.findByIdAndUpdate(
                'assignmentId',
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.assignmentId = counter.seq;
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
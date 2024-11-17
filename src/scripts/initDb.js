require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Counter = require('../models/Counter');

async function initializeCounters() {
    try {
        console.log('Connecting to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGODB_URI);
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Initialize user counter
        const userCounter = await Counter.findOneAndUpdate(
            { _id: 'userId' },
            { $setOnInsert: { seq: 0 } },
            { upsert: true, new: true }
        );
        console.log('User counter initialized:', userCounter);

        // Initialize assignment counter
        const assignmentCounter = await Counter.findOneAndUpdate(
            { _id: 'assignmentId' },
            { $setOnInsert: { seq: 0 } },
            { upsert: true, new: true }
        );
        console.log('Assignment counter initialized:', assignmentCounter);

        console.log('Counters initialized successfully');
        await mongoose.connection.close();
        console.log('Database connection closed');

    } catch (error) {
        console.error('Initialization error:', error);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
    }
    process.exit();
}

console.log('Starting counter initialization...');
initializeCounters();
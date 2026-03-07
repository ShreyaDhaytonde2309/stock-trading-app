const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User } = require('./models/Schemas');

dotenv.config();

const check = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const users = await User.find({});
        console.log('Users in DB:', users.map(u => ({ username: u.username, email: u.email })));
        process.exit(0);
    } catch (err) {
        console.error('Check Error:', err);
        process.exit(1);
    }
};

check();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User } = require('./models/Schemas');

dotenv.config();

const clear = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const result = await User.deleteMany({ email: 'admin@gmail.com' });
        console.log('Deleted users:', result.deletedCount);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

clear();

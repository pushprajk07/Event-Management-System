const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/eventManagementDB')
    .then(async () => {
        console.log('MongoDB Connected');

        // Check for existing users
        const users = await User.find({});
        console.log('Existing users:', users);

        // Create Admin if not exists
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const admin = new User({ username: 'admin', password: 'adminpassword', role: 'admin' });
            await admin.save();
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }

        // Create Normal User if not exists
        const userExists = await User.findOne({ username: 'user' });
        if (!userExists) {
            const user = new User({ username: 'user', password: 'userpassword', role: 'user' });
            await user.save();
            console.log('Normal user created');
        } else {
            console.log('Normal user already exists');
        }

        mongoose.connection.close();
    })
    .catch(err => console.log(err));

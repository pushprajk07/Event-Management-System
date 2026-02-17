const mongoose = require('mongoose');
const User = require('./models/User');
const Membership = require('./models/Membership');

mongoose.connect('mongodb://127.0.0.1:27017/eventManagementDB')
    .then(async () => {
        console.log('--- Connected to MongoDB ---');

        // Fetch and Log Users
        const users = await User.find({});
        console.log('\nPlease find the Users Collection Data below:');
        console.log(JSON.stringify(users, null, 2));

        // Fetch and Log Memberships
        const memberships = await Membership.find({});
        console.log('\nPlease find the Memberships Connection Data below:');
        console.log(JSON.stringify(memberships, null, 2));

        console.log('\n--- End of Data ---');
        mongoose.connection.close();
    })
    .catch(err => console.log(err));

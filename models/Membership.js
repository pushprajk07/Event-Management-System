const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    membershipNumber: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    membershipType: {
        type: String,
        enum: ['6 months', '1 year', '2 years'],
        default: '6 months'
    },
    status: {
        type: String,
        enum: ['active', 'cancelled'],
        default: 'active'
    }
});

module.exports = mongoose.model('Membership', membershipSchema);

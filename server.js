require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const User = require('./models/User');
const Membership = require('./models/Membership');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventManagementDB')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for checking if user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        res.locals.role = req.session.role; // Make role available to all views
        return next();
    }
    res.redirect('/login');
};

// Middleware for checking if user is admin
const isAdmin = (req, res, next) => {
    if (req.session.role === 'admin') {
        return next();
    }
    res.status(403).render('403');
};

// Routes

// Home Redirect
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Login
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('login', { error: 'Invalid username' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid password' });
        }

        req.session.userId = user._id;
        req.session.role = user.role;
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Server error' });
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

// Dashboard
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { role: req.session.role });
});

// Reports (Accessible to all)
app.get('/reports', isAuthenticated, (req, res) => {
    res.render('reports');
});

// Transactions (Accessible to all)
app.get('/transactions', isAuthenticated, (req, res) => {
    res.render('transactions');
});

// Maintenance (Admin Only)
app.get('/maintenance', isAuthenticated, isAdmin, (req, res) => {
    res.render('maintenance');
});

// Add Membership Page
app.get('/membership/add', isAuthenticated, isAdmin, (req, res) => {
    res.render('membership/add', { error: null, success: null });
});

// Add Membership Logic
app.post('/membership/add', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { membershipNumber, name, startDate, membershipType } = req.body;

        // Calculate End Date
        let start = new Date(startDate);
        let end = new Date(startDate);

        if (membershipType === '6 months') {
            end.setMonth(end.getMonth() + 6);
        } else if (membershipType === '1 year') {
            end.setFullYear(end.getFullYear() + 1);
        } else if (membershipType === '2 years') {
            end.setFullYear(end.getFullYear() + 2);
        }

        const newMembership = new Membership({
            membershipNumber,
            name,
            startDate: start,
            endDate: end,
            membershipType,
            status: 'active'
        });

        await newMembership.save();
        res.render('membership/add', { error: null, success: 'Membership added successfully!' });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            res.render('membership/add', { error: 'Membership Number already exists', success: null });
        } else {
            res.render('membership/add', { error: 'Error adding membership', success: null });
        }
    }
});

// Update Membership Page
app.get('/membership/update', isAuthenticated, isAdmin, (req, res) => {
    res.render('membership/update', { error: null, success: null, membership: null });
});

// Search Membership for Update
app.post('/membership/search', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { membershipNumber } = req.body;
        const membership = await Membership.findOne({ membershipNumber });

        if (!membership) {
            return res.render('membership/update', { error: 'Membership not found', success: null, membership: null });
        }

        res.render('membership/update', { error: null, success: null, membership });
    } catch (err) {
        console.error(err);
        res.render('membership/update', { error: 'Server error', success: null, membership: null });
    }
});

// Update Membership Logic
app.post('/membership/update', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { id, name, extension, cancel } = req.body;

        const membership = await Membership.findById(id);
        if (!membership) {
            return res.render('membership/update', { error: 'Membership not found', success: null, membership: null });
        }

        // Update fields
        membership.name = name;

        if (cancel) {
            membership.status = 'cancelled';
        } else {
            if (extension !== 'none') {
                let currentEnd = new Date(membership.endDate);
                if (extension === '6 months') {
                    currentEnd.setMonth(currentEnd.getMonth() + 6);
                } else if (extension === '1 year') {
                    currentEnd.setFullYear(currentEnd.getFullYear() + 1);
                } else if (extension === '2 years') {
                    currentEnd.setFullYear(currentEnd.getFullYear() + 2);
                }
                membership.endDate = currentEnd;
            }
        }

        await membership.save();
        res.render('membership/update', { error: null, success: 'Membership updated successfully!', membership: null });

    } catch (err) {
        console.error(err);
        res.render('membership/update', { error: 'Error updating membership', success: null, membership: null });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

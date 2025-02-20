const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const moment = require('moment');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Database initialization
const DatabaseInitializer = require('./config/initDb');
const dbInitializer = new DatabaseInitializer();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));

// EJS setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.messages = req.flash();
    res.locals.moment = moment;
    next();
});

// Routes
const adminRouter = require('./routes/admin/index.routes');
const carParkListsRouter = require('./routes/admin/carParkLists.routes');
const carParksRouter = require('./routes/admin/carParks.routes');
const camerasRouter = require('./routes/admin/cameras.routes');
const parkingEventsRouter = require('./routes/admin/parkingEvents.routes');

// Admin routes
app.use('/admin', adminRouter);
app.use('/admin/car-park-lists', carParkListsRouter);
app.use('/admin/car-parks', carParksRouter);
app.use('/admin/cameras', camerasRouter);
app.use('/admin/parking-events', parkingEventsRouter);

// Home route
app.get('/', (req, res) => {
    res.render('home', {
        title: 'ANPR System'
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).render('errors/404', {
        title: 'Page Not Found'
    });
});

// Start server
async function startServer() {
    try {
        // Initialize database first
        await dbInitializer.init();
        console.log('Database initialized successfully');

        // Then start the server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); // Exit if database initialization fails
    }
}

// Only start server if database initializes successfully
startServer(); 
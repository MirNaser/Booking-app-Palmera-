const express = require('express');
const passport = require('passport');
const session = require('express-session');
require('./auth'); // Import the auth config
require('dotenv').config();

const app = express();

// Setup session
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Set `true` if using HTTPS
    })
  );

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.send('<h1>Home Page</h1><a href="/auth/google">Login with Google</a>');
});

// Google OAuth Route
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth Callback
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Dashboard Route
app.get('/dashboard', (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.send(`<h1>Welcome ${req.user.displayName}</h1> <a href="/logout">Logout</a>`);
});

// Logout Route
app.get('/logout', (req, res) => {
  req.session = null;
  req.logout(() => {
    res.redirect('/');
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

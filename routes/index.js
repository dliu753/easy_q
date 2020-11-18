const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest } = require('../middleware/auth');

const Guest = require('../models/Guest');

// @desc Login - landing page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {layout: 'login'});
});

// @desc Dashboard
// @route GET /
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const guests = await Guest.find({ user: req.user.id }).lean();
        res.render('dashboard', {
            name: req.user.firstName,
            userId: req.user.id,
            guests
        });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }  
});

module.exports = router;
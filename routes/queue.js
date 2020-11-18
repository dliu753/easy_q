const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth')

const Guest = require('../models/Guest');
const User = require('../models/User');

// @desc post a queue entry
// @route POST /queue
router.post('/', async (req, res) => {
    // console.log(req.body);
    try {
        console.log(req.body);
        await Guest.create(req.body);
        res.redirect('back');
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// @desc Guest queue add page
// @route GET /queue/:id
router.get('/:userId', async (req, res) => {
    try {
        let queue = await User.findById(req.params.userId);
        const guests = await Guest.find({ user: req.params.userId }).lean();

        if (!queue) {
            return res.render('error/404');
        }
        else {
            // console.log(queue);
            res.render('guest/home', {
                layout: 'guest',
                name: queue.firstName,
                userId: req.params.userId,
                guests
            });
        }
    } catch (err) {
        console.error(err);
        res.render('error/404');
    }
});

// @desc Delete queue entry
// @route DELETE /queue/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Guest.deleteOne({_id: req.params.id });
        res.redirect('back');
        console.log("Guest id: " + req.params.id + " deleted.");
    } catch (err){
        console.log(err);
        return res.render('error/500');
    }
});


// @desc Delete oldest queue entry
// @route DELETE /queue/
router.delete('/pop/:userId', ensureAuth, async (req, res) => {
    try {
        console.log("finding: " + req.params.userId);
        let popIt;
        await Guest.find({user: req.params.userId}, {}, {sort: {'createdAt': 1}}, function (err, pop) {
            if(err) {
                console.log(err);
            } else {
                // console.log("I found " + pop);
                popIt = pop[0]._id;
            }
        });

        console.log("checking: " + popIt);
        await Guest.deleteOne({_id: popIt});
        res.redirect('back');
        // console.log("Guest id: " + popIt+ " deleted.");
    } catch (err){
        console.log(err);
        return res.render('error/500');
    }
});


module.exports = router;
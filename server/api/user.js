const express = require('express');
const router = express.Router();
const middleware = require('./middleware');

const User = require('../data/db/models/User');
const bcrypt = require('bcrypt');

router.post('/', (req, res, next) => {
    let errors = [];

    if (!req.body.email) {
        errors.push('Email is a required field');
    }

    if (!req.body.username) {
        errors.push('Username is a required field');
    }

    if (!req.body.password) {
        errors.push('Password is a required field');
    }

    if (errors.length) {
        return res.status(400).json({ errors: errors });
    }

    User.findOne({
        username: req.body.username
    })
    .exec((err, user) => {
        if (err) {
            return next(err);
        }

        if (user) {
            return res.status(400).json({
                errors: [
                    'Username already exists.'
                ]
            });
        }

        const newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
    
        bcrypt.hash(newUser.password, 10, (err, hash) => {
            if (err) {
                return next(err);
            }
    
            newUser.password = hash;
    
            newUser.save((err, doc) => {
                if (err) {
                    return next(err)
                } else {
                    // Save the user ID to the session to log the user in.
                    req.session.userId = doc._id;

                    return res.sendStatus(201);
                }
            });
        });
    });
});

router.get('/me', middleware.authenticate, (req, res, next) => {
    User.findById(req.session.userId, (err, user) => {
        if (err) {
            return next(err);
        }

        // Remove any props we don't want to send back.
        user = user.toObject();
        
        delete user.password;
        delete user.premiumEndDate;

        return res.status(200).json(user);
    });
});

router.post('/changeEmailPreference', middleware.authenticate, (req, res, next) => {
    User.findById(req.session.userId, (err, user) => {
        if (err) {
            return next(err);
        }

        user.emailEnabled = req.body.enabled;

        user.save((err, doc) => {
            if (err) {
                return next(err);
            }

            return res.sendStatus(200);
        });
    });
});

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { JWT_SECRET } = require('../../config/keys.js');

const User = mongoose.model('User');

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({
            error: true,
            message: 'Oops, please fill all the field.',
            data: null,
        });
    }

    User.findOne({ email: email })
        .then((userCheck) => {
            if (!userCheck) {
                return res.status(422).json({
                    error: true,
                    message: 'Oops, invalid email or password.',
                    data: null,
                });
            } else {
                bcrypt
                    .compare(password, userCheck.password)
                    .then((userData) => {
                        if (userData) {
                            const token = jwt.sign(
                                { _id: userCheck._id },
                                JWT_SECRET
                            );

                            const {
                                _id,
                                name,
                                email,
                                following,
                                followers,
                                photo,
                            } = userCheck;

                            return res.status(200).json({
                                error: false,
                                message: 'Yay, successfully login.',
                                data: {
                                    token: token,
                                    user: {
                                        _id,
                                        name,
                                        email,
                                        following,
                                        followers,
                                        photo,
                                    },
                                },
                            });
                        } else {
                            return res.status(422).json({
                                error: true,
                                message: 'Oops, invalid email or password.',
                                data: null,
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(422).json({
                error: true,
                message: err,
            });
        });
});

router.post('/signup', (req, res) => {
    const { name, email, password, photo } = req.body;

    if (!name || !email || !password) {
        return res.status(422).json({
            error: 'oops, please fill all the field.',
        });
    }

    User.findOne({ email: email })
        .then((user) => {
            if (user) {
                return res.status(422).json({
                    error: true,
                    message: 'Oops, user already exist.',
                    data: null,
                });
            } else {
                bcrypt
                    .hash(password, 12)
                    .then((hashedPassword) => {
                        const storeUser = new User({
                            name,
                            email,
                            password: hashedPassword,
                            photo,
                        });

                        storeUser
                            .save()
                            .then((user) => {
                                return res.status(200).json({
                                    error: false,
                                    message: 'Yay, successfully create user.',
                                    data: user,
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;

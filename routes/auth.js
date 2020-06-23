const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { MailgunTransport } = require('mailgun-nodemailer-transport');
const router = express.Router();
const { JWT_SECRET, MAILGUN, MAILGUN_DOMAIN } = require('../config/keys.js');

const User = mongoose.model('User');

let transporter = nodemailer.createTransport(
    new MailgunTransport({
        auth: {
            apiKey: MAILGUN,
            domain: MAILGUN_DOMAIN,
        },
    })
);

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
                                transporter
                                    .sendMail({
                                        from: 'no-replay@fadhilamadan.com',
                                        to: user.email,
                                        subject: 'Yay, Register successfully.',
                                        text: 'This is text content',
                                    })
                                    .then((info) => {
                                        console.log('SUCCESS', info);
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });

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

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buf) => {
        if (err) {
            return res.status(422).json({
                error: true,
                message: 'Oops, cant generate token.',
                data: err,
            });
        } else {
            const token = buf.toString('hex');

            User.findOne({ email: req.body.email })
                .then((user) => {
                    if (!user) {
                        return res.status(422).json({
                            error: true,
                            message: 'Oops, cant find the user.',
                            data: null,
                        });
                    } else {
                        user.resetToken = token;
                        user.expireToken = Date.now() + 3600000;
                        user.save().then((result) => {
                            transporter
                                .sendMail({
                                    from: 'no-replay@fadhilamadan.com',
                                    to: user.email,
                                    subject: 'Reset Password',
                                    html: `<p>You requested for password reset</p>
                                    <h5>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to reset your password</h5>`,
                                })
                                .then((info) => {
                                    console.log('SUCCESS', info);
                                })
                                .catch((error) => {
                                    console.log(error);
                                });

                            return res.status(200).json({
                                error: false,
                                message:
                                    'Yay, successfully send reset password to your email.',
                                data: user,
                            });
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    });
});

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password;
    const token = req.body.token;

    User.findOne({
        resetToken: token,
        expireToken: { $gt: Date.now() },
    })
        .then((user) => {
            if (!user) {
                return res.status(422).json({
                    error: true,
                    message: 'Oops, cant reset user password.',
                    data: null,
                });
            } else {
                bcrypt.hash(newPassword, 12).then((hashedPassword) => {
                    user.password = hashedPassword;
                    user.resetToken = undefined;
                    user.expireToken = undefined;

                    user.save()
                        .then((user) => {
                            return res.status(200).json({
                                error: false,
                                message: 'Yay, password updated.',
                                data: user,
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;

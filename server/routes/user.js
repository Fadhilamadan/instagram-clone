const express = require('express');
const mongoose = require('mongoose');
const loginMiddleware = require('../middleware/loginMiddleware.js');

const router = express.Router();

const User = mongoose.model('User');
const Post = mongoose.model('Post');

router.get('/user/:id', loginMiddleware, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select('-password -__v')
        .then((user) => {
            Post.find({ postedBy: req.params.id })
                .select('-postedBy -__v')
                .populate('postedBy', '_id name')
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({
                            error: true,
                            message: 'Oops, cant find any post.',
                            data: err,
                        });
                    } else {
                        return res.status(200).json({
                            error: false,
                            message: 'Yay, successfully find the user.',
                            data: { user, posts },
                        });
                    }
                });
        })
        .catch((err) => {
            return res.status(404).json({
                error: true,
                message: 'Oops, cant find the user.',
                data: err,
            });
        });
});

router.put('/follow', loginMiddleware, (req, res) => {
    User.findByIdAndUpdate(
        req.body.followId,
        {
            $push: { followers: req.user._id },
        },
        {
            new: true,
        },
        (err, follower) => {
            if (err) {
                return res.status(422).json({
                    error: true,
                    message: 'Oops, cant add followers.',
                    data: err,
                });
            } else if (follower) {
                User.findByIdAndUpdate(
                    req.user._id,
                    {
                        $push: { following: req.body.followId },
                    },
                    {
                        new: true,
                    }
                )
                    .select('-password')
                    .then((result) => {
                        return res.status(200).json({
                            error: false,
                            message: 'Yay, successfully following the user.',
                            data: result,
                        });
                    })
                    .catch((err) => {
                        return res.status(404).json({
                            error: true,
                            message: 'Oops, cant following the user.',
                            data: err,
                        });
                    });
            }
        }
    );
});

router.put('/unfollow', loginMiddleware, (req, res) => {
    User.findByIdAndUpdate(
        req.body.unfollowId,
        {
            $pull: { followers: req.user._id },
        },
        {
            new: true,
        },
        (err, unfollow) => {
            if (err) {
                return res.status(422).json({
                    error: true,
                    message: 'Oops, cant update unfollow.',
                    data: err,
                });
            } else if (unfollow) {
                User.findByIdAndUpdate(
                    req.user._id,
                    {
                        $pull: { following: req.body.unfollowId },
                    },
                    {
                        new: true,
                    }
                )
                    .select('-password')
                    .then((result) => {
                        return res.status(200).json({
                            error: false,
                            message: 'Yay, successfully unfollow the user.',
                            data: result,
                        });
                    })
                    .catch((err) => {
                        return res.status(404).json({
                            error: true,
                            message: 'Oops, cant unfollow the user.',
                            data: err,
                        });
                    });
            }
        }
    );
});

router.put('/updatePhoto', loginMiddleware, (req, res) => {
    Post.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                photo: req.body.photo,
            },
        },
        {
            new: true,
        },
        (err, result) => {
            if (err) {
                return res.status(422).json({
                    error: true,
                    message: 'Oops, cant update the photo.',
                    data: err,
                });
            } else {
                return res.status(200).json({
                    error: false,
                    message: 'Yay, successfully update the photo.',
                    data: result,
                });
            }
        }
    );
});

module.exports = router;

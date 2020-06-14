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

module.exports = router;

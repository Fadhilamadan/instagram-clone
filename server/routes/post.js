const express = require('express');
const mongoose = require('mongoose');
const loginMiddleware = require('../middleware/loginMiddleware.js');

const router = express.Router();
const Post = mongoose.model('Post');

router.get('/allPost', (req, res) => {
    Post.find()
        .populate('postedBy', '_id name')
        .then((post) => {
            return res.status(200).json({
                error: false,
                message: 'Yay, successfully load all post.',
                data: post,
            });
        })
        .catch((err) => {
            console.error(err);
        });
});

router.post('/createPost', loginMiddleware, (req, res) => {
    const { title, body } = req.body;

    if (!title || !body) {
        return res.status(422).json({
            error: true,
            message: 'Oops, please fill all the field.',
            data: null,
        });
    } else {
        const storePost = new Post({
            title,
            body,
            postedBy: req.user,
        });

        storePost
            .save()
            .then((post) => {
                return res.status(200).json({
                    error: false,
                    message: 'Yay, successfully create post.',
                    data: post,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

router.get('/myPost', loginMiddleware, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate('postedBy', '_id name')
        .then((post) => {
            return res.status(200).json({
                error: false,
                message: 'Yay, successfully load my post.',
                data: post,
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;

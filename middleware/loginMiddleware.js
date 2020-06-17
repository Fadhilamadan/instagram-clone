const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/keys.js');
const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            error: true,
            message: 'Oops, you must login first.',
        });
    } else {
        const token = authorization.replace('Bearer ', '');

        jwt.verify(token, JWT_SECRET, (err, payload) => {
            if (err) {
                return res.status(401).json({
                    error: true,
                    message: 'Oops, you must login first.',
                });
            } else {
                const { _id } = payload;

                User.findById(_id).then((userData) => {
                    req.user = userData;
                    next();
                });
            }
        });
    }
};

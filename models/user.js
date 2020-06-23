const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    expireToken: Date,
    photo: {
        type: String,
        default:
            'https://res.cloudinary.com/nukucode/image/upload/v1592385370/default_krnctp.png',
    },
    followers: [
        {
            type: ObjectId,
            ref: 'User',
        },
    ],
    following: [
        {
            type: ObjectId,
            ref: 'User',
        },
    ],
});

mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    message: {
        type: String,
        required: true,
    },
    date: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;

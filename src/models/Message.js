const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    room :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    user:{  //sender
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text:{
        type: String,
        required: true,
        trim: true,
        maxlength: 5000
    }
}, {timestamps: true});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
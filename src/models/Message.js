const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },

    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    type: {
        type: String,
        enum: [
            "text",
            "image",
            "video",
            "audio",
            "file",
            "link"
        ],
        default: "text"
    },

    text: {
        type: String,
        trim: true,
        default: ""
    },

    fileUrl: {
        type: String,
        default: ""
    },

    fileName: {
        type: String,
        default: ""
    },

    fileSize: {
        type: Number,
        default: 0
    },

    mimeType: {
        type: String,
        default: ""
    },

    duration: {
        type: Number,
        default: 0
    },

    thumbnail: { //Preview image for videos
        type: String,
        default: ""
    },

    isEdited: {
        type: Boolean,
        default: false
    },

    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
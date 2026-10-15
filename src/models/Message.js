const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },

    user: {  // Sender of the message
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

    fileUrl: {  // URL of the file (image, video, audio, etc.)
        type: String,
        default: ""
    },

    fileName: { // name of file shown to the user
        type: String,
        default: ""
    },

    fileSize: {
        type: Number,
        default: 0
    },

    mimeType: { // type of file (image/jpeg, video/mp4, audio/mpeg, etc.)
        type: String,
        default: ""
    },

    duration: { // Duration of the media file in seconds (for audio and video)
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
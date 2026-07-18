const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
{
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },

    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: true
    },

    type: {
        type: String,
        enum: ["message", "room", "system"],
        default: "message"
    },

    isRead: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
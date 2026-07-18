const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {

    const notifications = await Notification.find({
        recipient: req.user._id
    })

    .populate("sender", "username displayName avatar")

    .populate("room")

    .populate("message")

    .sort({ createdAt: -1 });

    res.json(notifications);

};

const markAsRead = async (req, res) => {

    await Notification.findByIdAndUpdate(req.params.id,{ isRead: true });

    res.json({success: true});

};

const deleteNotification = async (req, res) => {
    await Notification.findOneAndDelete({
        _id: req.params.id,
        recipient: req.user._id
    });

    res.json({ success: true});
};

module.exports = {
    getNotifications,
    markAsRead,
    deleteNotification
};